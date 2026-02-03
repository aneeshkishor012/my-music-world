"use client";

import { useParams } from "next/navigation";
import { useGetAlbumListWithId } from "@/app/hooks/jiosaavn/jiosaavn";
import Image from "next/image";
import type React from 'react';
import { PlayIcon, HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { usePlayer } from "@/app/context/PlayerContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import Breadcrumbs from "@/app/ui/components/Breadcrumbs";

export default function AlbumDetailPage() {
    const { id } = useParams();
    const { albumData: rawAlbumData, loading, error } = useGetAlbumListWithId(id);
    const albumData = rawAlbumData as any;
    const { play, playList, currentSong, isPlaying } = usePlayer();
    const { isFavorite, toggleFavorite } = useFavorites();

    if (loading) return <div className="p-10 text-center text-white">Loading album...</div>;
    if (error || !albumData) return <div className="p-10 text-center text-red-500">Error loading album.</div>;

    const songs = (albumData.songs || albumData.data?.songs || albumData.results || []) as any[];
    const albumImage = albumData.image?.[2]?.url || albumData.imageUri || albumData.image?.[1]?.url;
    const albumName = albumData.name || albumData.title || "Album";
    const liked = isFavorite(albumData.id);

    const playAll = () => {
        if (songs.length > 0) {
            playList(songs, 0);
        }
    };

    return (
        <div className="p-4 md:px-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 text-white">

            <Breadcrumbs items={[
                { label: "Home", href: "/home" },
                { label: "Albums", href: "/search/albums" },
                { label: albumName }
            ]} />

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end mb-10">
                <div className="relative w-64 h-64 shrink-0 shadow-2xl rounded-lg overflow-hidden">
                    <Image
                        src={albumImage || ""}
                        alt={albumData.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 256px"
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Album</p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{albumData.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300 justify-center md:justify-start">
                        <span className="font-bold text-white">{albumData.artists?.primary?.[0]?.name}</span>
                        <span>•</span>
                        <span>{albumData.year}</span>
                        <span>•</span>
                        <span>{songs.length} songs</span>
                    </div>

                    <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
                        <button
                            onClick={playAll}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transform transition hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <PlayIcon className="w-5 h-5" /> Play
                        </button>
                        <button
                            onClick={() => toggleFavorite({ ...albumData, type: 'album', title: albumData.name, imageUri: albumImage })}
                            className={`p-3 rounded-full border border-gray-600 hover:border-white transition ${liked ? 'text-red-500' : 'text-gray-400'}`}
                        >
                            {liked ? <HeartIcon className="w-6 h-6" /> : <HeartIconOutline className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Song List */}
            <div className="bg-black/20 rounded-xl p-4 md:p-6 mb-20">
                <div className="grid grid-cols-[50px_1fr_100px] gap-4 px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-bold mb-4">
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
                            className={`grid grid-cols-[50px_1fr_100px] gap-4 px-4 py-3 rounded-md hover:bg-white/5 transition items-center cursor-pointer group ${isCurrent ? 'bg-white/10' : ''}`}
                        >
                            <span className="text-gray-500 group-hover:text-white">
                                {isCurrent && isPlaying ? (
                                    <div className="h-4 w-4 flex gap-1 justify-center items-center">
                                        <div className="w-1 h-3 bg-blue-500 animate-bounce"></div>
                                        <div className="w-1 h-4 bg-blue-500 animate-bounce delay-100"></div>
                                        <div className="w-1 h-2 bg-blue-500 animate-bounce delay-200"></div>
                                    </div>
                                ) : index + 1}
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span className={`font-semibold truncate ${isCurrent ? 'text-blue-400' : 'text-white'}`}>{song.name}</span>
                                <span className="text-sm text-gray-400 truncate">{song.artists?.primary?.[0]?.name}</span>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        toggleFavorite({ ...song, type: 'song', title: song.name, imageUri: song.image?.[2]?.url });
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 transition ${songLiked ? 'opacity-100 text-red-500' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {songLiked ? <HeartIcon className="w-4 h-4" /> : <HeartIconOutline className="w-4 h-4" />}
                                </button>
                                <span className="text-gray-400 text-sm hidden sm:inline">{song.duration}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
