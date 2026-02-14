"use client";

import { useFavorites } from "../../context/FavoritesContext";
import { useState } from "react";
import Image from "next/image";
import { usePlayer } from "../../context/PlayerContext";
import { PlayIcon } from "@heroicons/react/24/solid";

import SidebarPlayer from "@/app/ui/components/SidebarPlayer";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
    const router = useRouter();
    const { favorites } = useFavorites();
    const { play, playList, currentSong, isPlaying } = usePlayer();
    const [filter, setFilter] = useState<"all" | "song" | "artist" | "album" | "playlist">("all");

    const filtered = filter === "all" ? favorites : favorites.filter(f => f.type === filter);

    const handleItemClick = (item: any) => {
        if (item.type === 'song') {
            // Filter only songs from the current view to create the queue
            const songList = filtered.filter(f => f.type === 'song');
            // if (item.url) play(item as any, songList);
            if (item.url) {
                const index = songList.findIndex(s => s.id === item.id);
                playList(songList, index !== -1 ? index : 0);
            }
        } else {
            // Navigate to the details page (e.g. /favorites/playlist/123 or /favorites/album/456)
            router.push(`/favorites/${item.type}/${item.id}`);
        }
    };

    return (
        <div className="h-full  text-white p-1 sm:p-2 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-1 sm:gap-2 h-full w-full">

                {/* LEFT CONTENT – Full width on mobile, 70% on desktop */}
                <div className="flex-1 min-w-0 h-1/2 lg:h-full overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="flex flex-row items-center gap-4 pb-3">

                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold px-1 sm:px-2 whitespace-nowrap shrink-0">
                            Favorites
                        </h1>

                        <div className="flex flex-1 gap-2 sm:gap-3 md:gap-4 border-gray-700 px-1 sm:px-2 overflow-x-auto">
                            {["all", "song", "artist", "album", "playlist"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab as any)}
                                    className={`capitalize transition text-md sm:text-sm whitespace-nowrap ${filter === tab
                                            ? "text-blue-500"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {tab === "all" ? "All" : tab + "s"}
                                </button>
                            ))}
                        </div>

                    </div>


                    {filtered.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10 md:mt-20">
                            <p className="text-sm md:text-lg">No favorites yet.</p>
                            <p className="text-xs md:text-sm">Go explore and heart what you love!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6 pb-20 px-1 sm:px-2">
                            {filtered.map((item, idx) => {
                                const isCurrent = currentSong?.id === item.id;
                                return (
                                    <div
                                        key={`${item.type}-${item.id}-${idx}`}
                                        className={`bg-[#1A2340] p-2 sm:p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-[#232F4D] transition cursor-pointer group flex flex-col items-center text-center ${isCurrent ? 'border border-blue-500' : ''}`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <div className={`w-full aspect-square overflow-hidden  mb-2 sm:mb-3 shadow-lg relative ${item.type === 'artist' ? 'rounded-full' : 'rounded-lg'}`}>
                                            {item.imageUri ? (
                                                <Image
                                                    src={item.imageUri}
                                                    alt={item.title || "Image"}
                                                    width={200}
                                                    height={200}
                                                    unoptimized
                                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl">?</div>}

                                            {/* Play Overlay for Songs */}
                                            {item.type === 'song' && (
                                                <div className={`absolute inset-0 bg-black/40 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                                                    <div className="bg-blue-600 text-white p-2 md:p-3 rounded-full shadow-lg transform hover:scale-110 transition">
                                                        {isCurrent && isPlaying ? (
                                                            <div className="h-5 w-5 md:h-6 md:w-6 flex gap-1 justify-center items-center">
                                                                <div className="w-1 h-2 md:h-3 bg-white animate-bounce"></div>
                                                                <div className="w-1 h-3 md:h-4 bg-white animate-bounce delay-100"></div>
                                                                <div className="w-1 h-2 md:h-2 bg-white animate-bounce delay-200"></div>
                                                            </div>
                                                        ) : (
                                                            <PlayIcon className="h-5 w-5 md:h-6 md:w-6 ml-0.5" />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white truncate w-full">{item.title}</h4>
                                        <p className="text-xs text-gray-400 truncate w-full hidden sm:line-clamp-1">{item.description}</p>
                                        <p className="text-xs text-blue-400 mt-1 capitalize">{item.type}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR – Hidden on mobile, 30% on desktop */}
                <div className="hidden lg:flex lg:w-[350px] xl:w-[400px] 2xl:w-[450px] h-full flex-shrink-0">
                    <SidebarPlayer />
                </div>
            </div>
        </div>
    );
}
