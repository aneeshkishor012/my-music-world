"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    Bars3BottomLeftIcon,
    ChevronLeftIcon,
    CheckIcon,
    ArrowDownTrayIcon,
    HeartIcon as HeartIconSolid
} from "@heroicons/react/24/solid";
import { usePlayer } from "@/app/context/PlayerContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import PlayerControl from "@/app/ui/components/PlayerControl";
import { Checkbox } from "antd";
import {
    HeartIcon,
    QueueListIcon,
    ArrowsRightLeftIcon,
    ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";

const PlayModeIcon = ({ mode }: { mode: string | undefined }) => {
    switch (mode) {
        case "shuffle":
            return (
                <ArrowsRightLeftIcon
                    className="w-4 h-4 text-gray-400"
                    title="Shuffle"
                />
            );

        case "repeatOne":
            return (
                <ArrowPathRoundedSquareIcon
                    className="w-4 h-4 text-gray-400"
                    title="Repeat One"
                />
            );

        case "order":
        default:
            return (
                <QueueListIcon
                    className="w-4 h-4 text-gray-400"
                    title="Play in Order"
                />
            );
    }
};

export default function SidebarPlayer() {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrev,
        queue,
        currentIndex,
        playList,
        activeEntity,
        setActiveEntity
    } = usePlayer();

    const { toggleFavorite, isFavorite } = useFavorites();

    // --- Size configuration (edit these values to change player image sizes) ---
    // Change `COVER_DIM_PX` to adjust the main cover image height/width (px).
    // Change `THUMB_SIZE_PX` to adjust small thumbnail width/height in the queue (px).
    const COVER_DIM_PX = 150; // default smaller size; reduce/increase as needed
    const THUMB_SIZE_PX = 24; // small queue thumbnails
    // -------------------------------------------------------------------------

    const queueRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLDivElement>(null);

    // Multi-select state
    const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());

    // Auto-scroll logic for Queue
    useEffect(() => {
        if (activeItemRef.current && !activeEntity) {
            activeItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [currentIndex, activeEntity]);

    const handleToggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = new Set(selectedSongs);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedSongs(next);
    };

    const handleSelectAll = () => {
        const list = activeEntity ? (activeEntity.songs || []) : queue;
        if (selectedSongs.size === list.length) {
            setSelectedSongs(new Set());
        } else {
            setSelectedSongs(new Set(list.map((s: any) => s.id)));
        }
    };

    const handleBulkFavorite = () => {
        const list = activeEntity ? (activeEntity.songs || []) : queue;
        list.forEach((s: any) => {
            if (selectedSongs.has(s.id) && !isFavorite(s.id)) {
                toggleFavorite({ ...s, type: "song" });
            }
        });
        setSelectedSongs(new Set());
    };

    const handleDownloadSelected = async () => {
        const list = activeEntity ? activeEntity.songs || [] : queue;

        for (const s of list) {
            if (selectedSongs.has(s.id) && s.url) {
                try {
                    const response = await fetch(s.url);
                    const blob = await response.blob();

                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");

                    link.href = blobUrl;
                    link.download = `${s.title || "song"}.mp3`;

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                } catch (err) {
                    console.error("Download failed:", s.title, err);
                }
            }
        }

        setSelectedSongs(new Set());
    };


    if (!currentSong && queue.length === 0 && !activeEntity) {
        return (
            <div className="hidden lg:flex flex-col items-center justify-center bg-[#0E1730] rounded-xl lg:rounded-2xl p-4 lg:p-6 h-full border border-white/5 text-gray-500">
                <Bars3BottomLeftIcon className="w-10 h-10 lg:w-12 lg:h-12 mb-4 opacity-20" />
                <p className="text-center text-xs lg:text-sm">No music in queue</p>
            </div>
        );
    }

    const displaySongs = activeEntity ? (activeEntity.songs || []) : queue;
    const title = activeEntity ? activeEntity.name || activeEntity.title : "Now Playing";
    const subTitle = activeEntity ? `${activeEntity.type} • ${displaySongs.length} Songs` : "Queue";

    return (
        <div className="hidden lg:flex flex-col bg-[#0E1730] rounded-xl lg:rounded-2xl h-full border border-white/5 shadow-2xl overflow-hidden relative">

            {/* ACTION BAR (When items selected) */}
            {selectedSongs.size > 0 && (
                <div className="absolute top-0 left-0 right-0 z-50 bg-blue-600 p-2 lg:p-3 flex items-center justify-between shadow-xl animate-slideDown">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <button onClick={() => setSelectedSongs(new Set())} className="text-white/80 hover:text-white p-1">
                            <ChevronLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                        <span className="text-white font-bold text-sm lg:text-base">{selectedSongs.size} Selected</span>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3">
                        <button onClick={handleBulkFavorite} title="Add to Favorites" className="p-1 lg:p-2 hover:bg-white/10 rounded-full transition">
                            <HeartIconSolid className="w-4 h-4 lg:w-5 lg:h-5 text-red-100" />
                        </button>
                        <button onClick={handleDownloadSelected} title="Download" className="p-1 lg:p-2 hover:bg-white/10 rounded-full transition">
                            <ArrowDownTrayIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER AREA */}
            <div className="pb-0 p-2 lg:p-3">
                {activeEntity && (
                    <button
                        onClick={() => setActiveEntity(null)}
                        className="flex items-center gap-1 text-gray-400 hover:text-white mb-3 lg:mb-4 transition text-xs lg:text-base"
                    >
                        <ChevronLeftIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="uppercase font-bold tracking-widest">Back to Player</span>
                    </button>
                )}

                {!activeEntity ? (
                    <div className="mb-4 lg:mb-6">
                        <div
                            className="relative w-full rounded-lg lg:rounded-xl overflow-hidden shadow-2xl mb-3 lg:mb-4 group"
                            style={{ height: `${COVER_DIM_PX}px` }}
                        >
                            {currentSong?.imageUri ? (
                                <>
                                    <Image
                                        src={currentSong.imageUri.replace("150x150", "500x500")}
                                        alt={currentSong.title}
                                        fill
                                        sizes={`(max-width: 1024px) 100vw, ${COVER_DIM_PX}px`}
                                        className="object-cover"
                                    />
                                </>
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <Bars3BottomLeftIcon className="w-10 h-10 lg:w-12 lg:h-12 text-gray-700" />
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg lg:text-xl font-bold text-white truncate px-1">{currentSong?.title || "Not Playing"}</h3>
                            <p className="text-xs lg:text-sm text-gray-400 truncate mt-1">{currentSong?.description || "Select a song"}</p>
                            <div className="flex items-center mb-3 lg:mb-4 px-1 justify-between mt-3 lg:mt-4">
                                <div
                                    onClick={handleSelectAll}
                                    className={`w-4 h-4 lg:w-5 lg:h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${displaySongs.length > 0 &&
                                        selectedSongs.size === displaySongs.length ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-gray-400'}`}
                                >
                                    {displaySongs.length > 0 &&
                                        selectedSongs.size === displaySongs.length && <CheckIcon className="w-3 h-3 text-white" />}
                                </div>
                                <PlayerControl isPlaying={isPlaying} togglePlay={togglePlay} playNext={playNext} playPrev={playPrev} />
                                <PlayModeIcon mode={"order"} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex p-2 lg:p-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
                        <div
                            className={`relative shrink-0 shadow-lg ${activeEntity.type === 'artist' ? 'rounded-full' : 'rounded-lg'} overflow-hidden`}
                            style={{ width: `${THUMB_SIZE_PX}px`, height: `${THUMB_SIZE_PX}px` }}
                        >
                            <Image
                                src={activeEntity.imageUri || (activeEntity.image?.[2]?.url) || ""}
                                alt={title}
                                fill
                                sizes={`${THUMB_SIZE_PX}px`}
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                            <h2 className="text-base lg:text-lg font-bold text-white leading-tight truncate">{title}</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{subTitle}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* LIST SECTION (Queue or Entity Songs) */}
            <div className="flex-1 min-h-0 flex flex-col p-2 lg:p-3 pt-0">
                <div
                    ref={queueRef}
                    className="flex-1 overflow-y-auto pr-1 lg:pr-2 space-y-1 lg:space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                >
                    {displaySongs.map((song: any, idx: number) => {
                        const isActive = !activeEntity && idx === currentIndex;
                        const isSelected = selectedSongs.has(song.id);
                        return (
                            <div
                                key={`${song.id}-${idx}`}
                                ref={isActive ? activeItemRef : null}
                                onClick={() => playList(displaySongs, idx)}
                                className={`flex items-center gap-2 lg:gap-3 p-1 rounded-lg transition overflow-hidden cursor-pointer group relative ${isActive ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                {/* Selection Indicator */}
                                <div
                                    onClick={(e: React.MouseEvent) => handleToggleSelect(song.id, e)}
                                    className={`w-4 h-4 lg:w-5 lg:h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-gray-400'}`}
                                >
                                    {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                                </div>

                                <div
                                    className="relative rounded overflow-hidden shrink-0"
                                    style={{ width: `${THUMB_SIZE_PX}px`, height: `${THUMB_SIZE_PX}px` }}
                                >
                                    <Image
                                        src={song.imageUri || ""}
                                        alt={song.title}
                                        fill
                                        sizes={`${THUMB_SIZE_PX}px`}
                                        className="object-cover"
                                    />
                                    {isActive && isPlaying && (
                                        <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                                            <div className="flex gap-0.5 items-end h-3">
                                                <div className="w-0.5 bg-white animate-bounce h-2"></div>
                                                <div className="w-0.5 bg-white animate-bounce h-3 delay-75"></div>
                                                <div className="w-0.5 bg-white animate-bounce h-1.5 delay-150"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-xs lg:text-sm font-semibold truncate ${isActive ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>
                                        {song.title}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {song.description}
                                    </p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            toggleFavorite({ ...song, type: "song" });
                                        }}
                                        className="p-1 hover:text-red-500 text-gray-500 transition"
                                    >
                                        {isFavorite(song.id) ? <HeartIconSolid className="w-3 h-3 lg:w-4 lg:h-4 text-red-500" /> : <HeartIcon className="w-3 h-3 lg:w-4 lg:h-4" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
