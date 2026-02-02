"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import {
    getAlbumListWithId,
    getArtistListWithId,
    getPlayListWithId
} from "../hooks/jiosaavn/jiosaavn";

export type Song = {
    id: string;
    title: string;
    description?: string;
    imageUri?: string;
    url?: string; // Audio URL
    duration?: string;
    type?: string;
};

type PlayerMode = 'normal' | 'shuffle' | 'repeat_one';

type PlayerContextType = {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    play: (song: Song) => void;
    playList: (songs: Song[], startIndex: number) => void;
    pause: () => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    addToQueue: (song: Song) => void;
    mode: PlayerMode;
    toggleMode: () => void;
    currentIndex: number;
    activeEntity: any | null;
    setActiveEntity: (entity: any | null) => void;
    loadEntity: (id: string, type: string) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [mode, setMode] = useState<PlayerMode>('normal');
    const [activeEntity, setActiveEntity] = useState<any | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio();

        const handleEnded = () => {
            playNextRef.current();
        };

        audioRef.current.addEventListener("ended", handleEnded);

        return () => {
            audioRef.current?.removeEventListener("ended", handleEnded);
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    // Ref hack to access latest function in event listener
    const playNextRef = useRef(() => { });

    const playSongInternal = (song: Song) => {
        if (!audioRef.current) return;
        if (!song.url) {
            console.warn("No URL for song:", song.title);
            playNextRef.current();
            return;
        }

        audioRef.current.src = song.url;
        audioRef.current.play().catch(e => console.error("Playback error", e));
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const play = (song: Song) => {
        setQueue([song]);
        setCurrentIndex(0);
        playSongInternal(song);
    };

    const playList = (songs: Song[], startIndex: number) => {
        if (!songs || songs.length === 0) return;
        const index = Math.max(0, Math.min(startIndex, songs.length - 1));
        setQueue(songs);
        setCurrentIndex(index);
        playSongInternal(songs[index]);
    };

    const addToQueue = (song: Song) => {
        setQueue(prev => [...prev, song]);
    };

    const playNext = () => {
        if (mode === 'repeat_one') {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
            return;
        }

        if (queue.length === 0) return;

        let nextIndex = currentIndex + 1;

        if (mode === 'shuffle') {
            nextIndex = Math.floor(Math.random() * queue.length);
        }

        if (nextIndex >= queue.length) {
            // End of queue. Stop or loop? Let's stop for 'normal'.
            setIsPlaying(false);
            return;
        }

        setCurrentIndex(nextIndex);
        playSongInternal(queue[nextIndex]);
    };

    const playPrev = () => {
        if (queue.length === 0) return;
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = 0;

        setCurrentIndex(prevIndex);
        playSongInternal(queue[prevIndex]);
    };

    const pause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (isPlaying) pause();
        else {
            audioRef.current?.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const toggleMode = () => {
        setMode(prev => {
            if (prev === 'normal') return 'shuffle';
            if (prev === 'shuffle') return 'repeat_one';
            return 'normal';
        });
    };

    // Update ref
    useEffect(() => {
        playNextRef.current = playNext;
    }); // Update on every render

    const loadEntity = async (id: string, type: string) => {
        try {
            let data: any = null;
            if (type === "album") data = await getAlbumListWithId(id);
            else if (type === "artist") data = await getArtistListWithId(id);
            else if (type === "playlist") data = await getPlayListWithId(id, 1, 100);

            if (data?.data) {
                const songs = (data.data.songs || data.data.topSongs || []).map((song: any) => ({
                    ...song,
                    title: song.name || song.title,
                    description: song.artists?.primary?.[0]?.name || song.label || "Artist",
                    imageUri: song.image?.[2]?.url || song.image?.[1]?.url || "/placeholder.png",
                    url: song.downloadUrl?.[4]?.url || song.downloadUrl?.[0]?.url
                }));

                setActiveEntity({ ...data.data, type, songs });
                // Load songs into queue
                setQueue(songs);
                setCurrentIndex(-1);
            }
        } catch (err) {
            console.error("Error loading entity:", err);
        }
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            queue,
            play,
            playList,
            pause,
            togglePlay,
            playNext,
            playPrev,
            addToQueue,
            mode,
            toggleMode,
            currentIndex,
            activeEntity,
            setActiveEntity,
            loadEntity
        }}>
            {/* Bottom Player logic shouldn't be here in context file usually, but keeping it simple as per previous structure. 
                 Actually better to move UI to a separate component. I will remove the UI part from here and let the user put it in layout/page.
             */}
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
}
