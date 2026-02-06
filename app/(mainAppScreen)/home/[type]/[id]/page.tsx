"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";
import { ChevronLeftIcon, InformationCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import { usePlayer } from "@/app/context/PlayerContext";
import { useInfiniteMusic } from "@/app/hooks/useMusicData";

export default function FavoriteDetailsPage() {
    const router = useRouter();
    const params = useSearchParams();

    const itemParam = params.get("item");

    const item = itemParam ? JSON.parse(itemParam) : null;


    const { playList, currentSong, isPlaying } = usePlayer();

    // Use the item title to fetch songs. 
    const query = item?.title || "";

    const { data: fetchedSongs, loading: isLoadingHook } = useInfiniteMusic(query, item?.type || "", item?.id || "");
    // Prioritize songs stored directly in the favorite item (if any), otherwise use fetched results

    const itemSongs = (item as any)?.songs;
    const hasLocalSongs = Array.isArray(itemSongs) && itemSongs.length > 0;

    const songs = hasLocalSongs ? itemSongs : fetchedSongs;
    const loading = hasLocalSongs ? false : isLoadingHook;

    if (!item) {
        return (
            <div className="h-full bg-[#12121F] text-white p-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">Item not found in favorites.</p>
                    <button onClick={() => router.push('/favorites')} className="text-blue-400 hover:underline">
                        Go to Favorites
                    </button>
                </div>
            </div>
        );
    }

    const handleItemClick = (index: number) => {
        playList(fetchedSongs, index);
    };
    return (
        <div className="h-full bg-[#12121F] text-white p-1 sm:p-2 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-1 sm:gap-2 h-full w-full">
                {/* LEFT CONTENT */}
                <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="bg-blue-500/10 pt-2 pb-2 pl-2 pr-2 rounded-xl mb-2">
                        <div className="flex flex-row justify-between items-center px-2">
                            <button
                                onClick={() => router.back()}
                                className="mb-4 px-3 py-1 bg-[#1A2340] rounded-md text-sm text-gray-300 hover:text-white hover:bg-[#232F4D] transition"
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            <h4 className="text-sm text-blue-400 uppercase tracking-wider mb-1">{item.type}</h4>

                            <button
                                className="mb-4 px-3 py-1 bg-[#1A2340] rounded-md text-sm text-gray-300 hover:text-white hover:bg-[#232F4D] transition"
                            >
                                <InformationCircleIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 px-2">
                            <div className="w-48 h-48 relative shrink-0 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                {item.imageUri ? (
                                    <Image
                                        src={item.imageUri}
                                        alt={item.title || "Cover"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">?</div>
                                )}
                            </div>
                            <div className="flex flex-col justify-end items-center text-center md:items-start md:text-left">
                                <h1 className="text-3xl md:text-5xl font-bold mb-3">{item.title}</h1>

                                <p className="text-gray-400 max-w-xl">
                                    {item.description}
                                </p>

                                <div className="mt-4 flex gap-3 justify-center md:justify-start">
                                    <button
                                        onClick={() => songs.length > 0 && handleItemClick(0)}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition shadow-lg shadow-blue-900/20"
                                    >
                                        <PlayIcon className="w-5 h-5" /> Play
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="bg-[#0E1730] rounded-xl p-2 sm:p-4">
                        <h3 className="text-xl font-bold mb-4 px-2">Songs</h3>
                        {loading ? (
                            <div className="text-gray-500 px-2">Loading songs...</div>
                        ) : songs.length === 0 ? (
                            <div className="text-gray-500 px-2">No songs found.</div>
                        ) : (
                            <div className="space-y-2">
                                {songs.map((song, idx) => {
                                    const isCurrent = currentSong?.id === song.id;
                                    return (
                                        <div
                                            key={`${song.id}-${idx}`}
                                            onClick={() => handleItemClick(idx)}
                                            className={`flex items-center p-3 bg-blue-500/10 rounded-lg cursor-pointer group transition ${isCurrent ? 'bg-[#1A2340] border border-blue-500/30' : 'hover:bg-[#1A2340] border border-transparent'}`}
                                        >
                                            <div className="w-8 text-center text-gray-500 mr-4 group-hover:text-white">
                                                <span >{idx + 1}</span>
                                            </div>
                                            <div className="w-10 h-10 relative mr-4 bg-gray-800 rounded overflow-hidden shrink-0">
                                                {song.imageUri && <Image src={song.imageUri} alt={song.title} fill className="object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-medium truncate ${isCurrent ? 'text-blue-400' : 'text-white'}`}>{song.title || song.name}</h4>
                                                <p className="text-xs text-gray-400 truncate">{song.description || song.label}</p>
                                            </div>
                                            <div className="text-sm text-gray-500 ml-4">
                                                {song.duration || "--:--"}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden lg:flex lg:w-[350px] xl:w-[400px] 2xl:w-[450px] h-full flex-shrink-0">
                    <SidebarPlayer />
                </div>
            </div>
        </div>
    );
}
