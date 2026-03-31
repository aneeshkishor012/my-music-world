"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";
import { usePlayer } from "@/app/context/PlayerContext";
import { useInfiniteMusic } from "@/app/hooks/useMusicData";
import PlaylistMasterCard from "@/app/ui/components/PlaylistScreen/playlistMasterCard";

export default function FavoriteDetailsPage() {
    const router = useRouter();
    const params = useSearchParams();

    const itemParam = params.get("item");

    const item = itemParam ? JSON.parse(itemParam) : null;


    // const { favorites } = useFavorites();
    const { play, playList, currentSong, isPlaying } = usePlayer();

    // Find the item (Playlist, Album, Artist) in the favorites list
    // Using String() ensures we match even if one is a number and the other is a string
    // const item = favorites.find(f => String(f.id) === String(id) && f.type === type);
    // const item = favorites.find(f => String(f.id) === String(id) && f.type === type);

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
            <div className="h-full  text-white p-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">Item not found in suggection.</p>
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
        <div className="h-full  text-white p-1 sm:p-2 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-1 sm:gap-2 h-full w-full">
                {/* LEFT CONTENT */}
                <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <PlaylistMasterCard item={item} songs={songs} handleItemClick={handleItemClick} />

                    <div className=" rounded-xl p-2 sm:p-4">
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
                                            className={`
                                                flex items-center p-3 rounded-xl cursor-pointer group
                                                transition-all duration-300
                                                border border-white/10
                                                bg-white/5
                                                hover:bg-white/10
                                                hover:scale-[1.01]
                                                ${isCurrent ? "bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 border-purple-500/40 shadow-lg shadow-purple-500/10" : ""} `}>
                                            <div className="w-8 text-center text-gray-500 mr-4 group-hover:text-white">
                                                <span >{idx + 1}</span>
                                            </div>
                                            <div className="w-10 h-10 relative mr-4 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                                {song.imageUri && <Image
                                                    src={song.imageUri}
                                                    alt={song.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm truncate transition-colors duration-300 ${isCurrent ? "text-purple-300" : "text-white"}`} >
                                                    {song.title || song.name}
                                                </p>
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
