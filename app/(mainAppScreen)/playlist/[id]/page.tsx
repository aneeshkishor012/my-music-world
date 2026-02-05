"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetPlayListWithId } from "@/app/hooks/jiosaavn/jiosaavn";
import Image from "next/image";
import type React from 'react';
import { PlayIcon, HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { usePlayer } from "@/app/context/PlayerContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import Breadcrumbs from "@/app/ui/components/Breadcrumbs";

export default function PlaylistDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { playlistData: rawPlaylistData, loading, error } = useGetPlayListWithId(id);
    const playlistData = rawPlaylistData as any;
    const { play, playList, currentSong, isPlaying } = usePlayer();
    const { isFavorite, toggleFavorite } = useFavorites();

    if (loading) return <div className="p-10 text-center text-white">Loading playlist...</div>;
    if (error || !playlistData) return <div className="p-10 text-center text-red-500">Error loading playlist.</div>;

    const songs = (playlistData.songs || playlistData.data?.songs || playlistData.results || []) as any[];
    const playlistImage = playlistData.image?.[2]?.url || playlistData.imageUri || playlistData.image?.[1]?.url;
    const playlistName = playlistData.name || playlistData.title || "Playlist";
    const liked = isFavorite(playlistData.id);

    const playAll = () => {
        if (songs.length > 0) {
            playList(songs, 0);
        }
    };

    return (
        <div className="p-2 sm:p-3 md:p-4 lg:px-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 text-white">

            <Breadcrumbs items={[
                { label: "Home", href: "/home" },
                { label: "Playlists", href: "/search/playlists" },
                { label: playlistName }
            ]} />

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-end mb-6 md:mb-10">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 shrink-0 shadow-2xl rounded-lg overflow-hidden">
                    <Image
                        src={playlistImage || ""}
                        alt={playlistName}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, 256px"
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">Playlist</p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">{playlistName}</h1>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300 justify-center md:justify-start">
                        <span className="font-bold text-white">{playlistData.userId ? `By ${playlistData.userId}` : 'JioSaavn Official'}</span>
                        <span>•</span>
                        <span>{songs.length} songs</span>
                        <span>•</span>
                        <span>{playlistData.fanCount || 0} fans</span>
                    </div>

                    <div className="mt-4 md:mt-8 flex items-center gap-2 md:gap-4 justify-center md:justify-start">
                        <button
                            onClick={playAll}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-full font-bold flex items-center gap-2 transform transition hover:scale-105 active:scale-95 shadow-lg text-sm md:text-base"
                        >
                            <PlayIcon className="w-4 h-4 md:w-5 md:h-5" /> Play
                        </button>
                        <button
                            onClick={() => toggleFavorite({ ...playlistData, type: 'playlist', title: playlistName, imageUri: playlistImage })}
                            className={`p-2 md:p-3 rounded-full border border-gray-600 hover:border-white transition ${liked ? 'text-red-500' : 'text-gray-400'}`}
                        >
                            {liked ? <HeartIcon className="w-5 h-5 md:w-6 md:h-6" /> : <HeartIconOutline className="w-5 h-5 md:w-6 md:h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Song List */}
            <div className="bg-black/20 rounded-lg md:rounded-xl p-2 md:p-4 lg:p-6 mb-20">
                <div className="hidden md:grid grid-cols-[50px_1fr_100px] gap-4 px-4 py-2 border-b border-gray-800 text-gray-400 text-xs md:text-sm font-bold mb-4">
                    <span>#</span>
                    <span>TITLE</span>
                    <span className="text-right">DURATION</span>
                </div>

                {songs.map((song: any, index: number) => {
                    const isCurrent = currentSong?.id === song.id;
                    const songLiked = isFavorite(song.id);

                    return (
                        <div
                            key={song.id}
                            onClick={() => playList(songs, index)}
                            className={`flex md:grid md:grid-cols-[50px_1fr_100px] gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 rounded-md hover:bg-white/5 transition items-center cursor-pointer group ${isCurrent ? 'bg-white/10' : ''}`}
                        >
                            <span className="text-gray-500 group-hover:text-white text-xs md:text-base hidden md:inline">
                                {isCurrent && isPlaying ? (
                                    <div className="h-4 w-4 flex gap-1 justify-center items-center">
                                        <div className="w-1 h-3 bg-blue-500 animate-bounce"></div>
                                        <div className="w-1 h-4 bg-blue-500 animate-bounce delay-100"></div>
                                        <div className="w-1 h-2 bg-blue-500 animate-bounce delay-200"></div>
                                    </div>
                                ) : index + 1}
                            </span>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className={`font-semibold truncate text-xs sm:text-sm md:text-base ${isCurrent ? 'text-blue-400' : 'text-white'}`}>{song.name || song.title}</span>
                                <span className="text-xs text-gray-400 truncate">{song.artists?.primary?.[0]?.name || song.label}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2 md:gap-4">
                                <button
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        toggleFavorite({ ...song, type: 'song', title: song.name || song.title, imageUri: song.image?.[2]?.url });
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 transition ${songLiked ? 'opacity-100 text-red-500' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {songLiked ? <HeartIcon className="w-3 h-3 md:w-4 md:h-4" /> : <HeartIconOutline className="w-3 h-3 md:w-4 md:h-4" />}
                                </button>
                                <span className="text-gray-400 text-xs md:text-sm hidden sm:inline">{song.duration}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
