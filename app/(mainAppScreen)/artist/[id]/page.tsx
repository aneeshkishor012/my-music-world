"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetArtistListWithId } from "@/app/hooks/jiosaavn/jiosaavn";
import Image from "next/image";
import type React from 'react';
import { PlayIcon, HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { usePlayer } from "@/app/context/PlayerContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import Breadcrumbs from "@/app/ui/components/Breadcrumbs";

export default function ArtistDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { artistData: rawArtistData, loading, error } = useGetArtistListWithId(id);
    const artistData = rawArtistData as any;
    const { play, playList, currentSong, isPlaying } = usePlayer();
    const { isFavorite, toggleFavorite } = useFavorites();

    if (loading) return <div className="p-10 text-center text-white">Loading artist...</div>;
    if (error || !artistData) return <div className="p-10 text-center text-red-500">Error loading artist.</div>;

    const songs = (artistData.songs || artistData.data?.topSongs || []) as any[];
    const albums = (artistData.albums || artistData.data?.topAlbums || []) as any[];
    const artistImage = artistData.image?.[3]?.url || artistData.imageUri || artistData.image?.[2]?.url;
    const artistName = artistData.name || artistData.title || "Artist";
    const liked = isFavorite(artistData.id);

    return (
        <div className="p-4 md:px-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 text-white">

            <Breadcrumbs items={[
                { label: "Home", href: "/home" },
                { label: "Artists", href: "/search/artists" },
                { label: artistName }
            ]} />

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end mb-10">
                <div className="relative w-64 h-64 shrink-0 shadow-2xl rounded-full overflow-hidden border-4 border-white/10">
                    <Image
                        src={artistImage || ""}
                        alt={artistName}
                        fill
                        sizes="(max-width: 768px) 100vw, 256px"
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Artist</p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{artistName}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300 justify-center md:justify-start">
                        <span className="font-bold text-white">{artistData.followerCount ? `${artistData.followerCount} followers` : 'Verified Artist'}</span>
                        <span>•</span>
                        <span>{artistData.dominantLanguage || "Various"}</span>
                        <span>•</span>
                        <span>{songs.length} top songs</span>
                    </div>

                    <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => songs.length > 0 && playList(songs, 0)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transform transition hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <PlayIcon className="w-5 h-5" /> Play Top Songs
                        </button>
                        <button
                            onClick={() => toggleFavorite({ ...artistData, type: 'artist', title: artistName, imageUri: artistImage })}
                            className={`p-3 rounded-full border border-gray-600 hover:border-white transition ${liked ? 'text-red-500' : 'text-gray-400'}`}
                        >
                            {liked ? <HeartIcon className="w-6 h-6" /> : <HeartIconOutline className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Songs */}
            <h2 className="text-2xl font-bold mb-4">Top Songs</h2>
            <div className="bg-black/20 rounded-xl p-4 md:p-6 mb-10">
                {songs.map((song: any, index: number) => {
                    const isCurrent = currentSong?.id === song.id;
                    const songLiked = isFavorite(song.id);
                    return (
                        <div
                            key={song.id}
                            onClick={() => playList(songs, index)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-md hover:bg-white/5 transition cursor-pointer group ${isCurrent ? 'bg-white/10' : ''}`}
                        >
                            <span className="w-8 text-gray-500 group-hover:text-white">
                                {isCurrent && isPlaying ? (
                                    <div className="h-4 w-4 flex gap-1 justify-center items-center">
                                        <div className="w-1 h-3 bg-blue-500 animate-bounce"></div>
                                        <div className="w-1 h-4 bg-blue-500 animate-bounce delay-100"></div>
                                        <div className="w-1 h-2 bg-blue-500 animate-bounce delay-200"></div>
                                    </div>
                                ) : index + 1}
                            </span>
                            <div className="w-12 h-12 relative rounded overflow-hidden shrink-0">
                                <Image src={song.imageUri || song.image?.[2]?.url || ""} alt={song.name || song.title} fill sizes="48px" className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold truncate ${isCurrent ? 'text-blue-400' : 'text-white'}`}>{song.name || song.title}</h4>
                                <p className="text-sm text-gray-400 truncate">{song.album?.name || artistName}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        toggleFavorite({ ...song, type: 'song', title: song.name || song.title, imageUri: song.image?.[2]?.url });
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 transition ${songLiked ? 'opacity-100 text-red-500' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {songLiked ? <HeartIcon className="w-4 h-4" /> : <HeartIconOutline className="w-4 h-4" />}
                                </button>
                                <span className="text-gray-400 text-sm">{song.duration}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Albums Section */}
            {albums.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-4">Albums</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-20">
                        {albums.map((album: any) => (
                            <div
                                key={album.id}
                                onClick={() => router.push(`/album/${album.id}`)}
                                className="bg-[#1A2340] p-4 rounded-xl hover:bg-[#232F4D] transition cursor-pointer group"
                            >
                                <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-3 shadow-lg">
                                    <Image src={album.imageUri || album.image?.[2]?.url || ""} alt={album.name || album.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px" className="object-cover group-hover:scale-110 transition duration-300" />
                                </div>
                                <h4 className="font-semibold truncate">{album.name || album.title}</h4>
                                <p className="text-sm text-gray-400">{album.year}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
