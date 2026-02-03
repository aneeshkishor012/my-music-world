"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import type React from 'react';
import { PlayIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useGenericData } from "@/app/hooks/useGenericData";
import { usePlayer } from "@/app/context/PlayerContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useRef, useEffect } from "react";

export function ResuableSearchSection({ title, type, query, onShowMore, limit = 5, showPagination = false, infinite = false, maxItems = null }: any) {
    const router = useRouter();
    const { data, loading, hasMore, loadMore, total, page, loadPage } = useGenericData(query, type, limit); // Fetch configurable number
    const { play, playList, currentSong, isPlaying, loadEntity } = usePlayer();
    const { isFavorite, toggleFavorite } = useFavorites();
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Helper: find nearest scrollable ancestor
    // Also treat elements as scrollable when their scrollHeight exceeds clientHeight
    const findScrollParent = (el: HTMLElement | null): HTMLElement | null => {
        while (el) {
            const style = getComputedStyle(el);
            const overflowY = style.overflowY;
            const isOverflowing = el.scrollHeight > el.clientHeight;
            if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay' || isOverflowing) return el;
            el = el.parentElement;
        }
        return null;
    };

    useEffect(() => {
        if (!infinite) return; // only observe when infinite scrolling enabled
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const root = findScrollParent(sentinel.parentElement) || null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // If a maximum item limit is set, prevent loading beyond it
                    if (maxItems != null && data.length >= maxItems) return;
                    if (hasMore && !loading) loadMore();
                }
            });
        }, { root, rootMargin: '200px' });

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [infinite, hasMore, loading, loadMore, data.length, maxItems]);

    if (!loading && data.length === 0) return null; // Don't show empty sections

    const handleItemClick = (item: any, index: number) => {
        if (type === "song") {
            // Queue the entire list
            playList(data, index);
        } else {
            // Show details in Sidebar and load songs
            loadEntity(item.id, type);
        }
    };

    return (
        <section className="mb-10 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="flex justify-between items-center mb-6 px-1">
                <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
                <button
                    onClick={onShowMore}
                    className="text-sm font-medium text-gray-400 hover:text-white transition"
                >
                    View All
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7 gap-6">
                {(maxItems != null ? data.slice(0, maxItems) : data).map((item, idx) => {
                    const liked = isFavorite(item.id);
                    const isCurrent = currentSong?.id === item.id;
                    console.log("Rendering item:", item);
                    return (
                        <div
                            key={`${item.id}-${idx}`}
                            onClick={() => handleItemClick(item, idx)}
                            className="bg-[#1A2340] rounded-xl hover:bg-[#232F4D] transition cursor-pointer group flex flex-col items-center text-center relative"
                        >
                            {/* Heart Button */}
                            <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    toggleFavorite({ ...item, type });
                                }}
                                className={`absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition ${liked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            >
                                {liked ? <HeartIconSolid className="w-4 h-4 text-red-500" /> : <HeartIcon className="w-4 h-4" />}
                            </button>

                            <div className={`w-full aspect-square overflow-hidden bg-gray-800 mb-2 relative rounded-md`}>
                                {item.imageUri ? (
                                    <Image
                                        src={item.imageUri}
                                        alt={item.title || "Image"}
                                        width={150}
                                        height={150}
                                        unoptimized={type === 'artist' ? true : false} // bypass Next.js optimization for remote images that may block
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : <div className="w-full h-full flex items-center justify-center text-2xl">?</div>}

                                {/* Play Overlay for Songs */}
                                {type === 'song' && (
                                    <div className={`absolute inset-0 bg-black/40 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                                        <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                            {isCurrent && isPlaying ? (
                                                <div className="h-4 w-4 flex gap-0.5 justify-center items-center">
                                                    <div className="w-0.5 h-2 bg-white animate-bounce"></div>
                                                    <div className="w-0.5 h-3 bg-white animate-bounce delay-100"></div>
                                                    <div className="w-0.5 h-1.5 bg-white animate-bounce delay-200"></div>
                                                </div>
                                            ) : (
                                                <PlayIcon className="h-4 w-4 ml-0.5 text-white fill-current" />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="px-2 pb-3 w-full">
                                <h4 className={`text-sm font-semibold truncate w-full ${isCurrent ? 'text-blue-400' : 'text-white'}`}>{item.title}</h4>
                                <p className="text-xs text-gray-400 truncate w-full">{item.description}</p>
                            </div>
                        </div>
                    );
                })}

                {loading && Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-700 w-full aspect-square rounded-md mb-2"></div>
                        <div className="bg-gray-700 h-4 w-3/4 mb-1"></div>
                        <div className="bg-gray-800 h-3 w-1/2"></div>
                    </div>
                ))}
            </div>

            {/* Sentinel for infinite scroll (only used when `infinite` is true) */}
            {infinite && <div ref={sentinelRef} className="h-2" />}
        </section>
    );
}
