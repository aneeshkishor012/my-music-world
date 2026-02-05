"use client";

import { usePlayer } from "@/app/context/PlayerContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import Image from "next/image";
import { useState } from "react";
import {
    PlayIcon,
    PauseIcon,
    ForwardIcon,
    BackwardIcon,
    HeartIcon as HeartIconSolid,
    Bars3BottomLeftIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function BottomControlPanel({
    onCollapse,
    onOpenFullPlayer,
}: {
    onCollapse: () => void;
    onOpenFullPlayer: () => void;
}) {
    const { currentSong, isPlaying, togglePlay, playNext, playPrev } = usePlayer();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [imageRotate, setImageRotate] = useState(0);

    if (!currentSong) return null;

    const handleRotateImage = () => {
        setImageRotate((prev) => (prev + 45) % 360);
    };

    return (
        <div className="fixed bottom-20 left-0 right-0 z-30 md:hidden bg-[#0E1730] border-t border-gray-700 rounded-t-2xl shadow-2xl animate-slideUp">
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
                <div
                    onClick={onCollapse}
                    className="w-12 h-1 bg-gray-600 rounded-full hover:bg-gray-400 cursor-pointer transition"
                />
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 pb-6">
                {/* Song Image with Rotate */}
                <div className="flex justify-center">
                    <button
                        onClick={handleRotateImage}
                        className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform"
                    >
                        {currentSong.imageUri && (
                            <Image
                                src={currentSong.imageUri}
                                alt={currentSong.title}
                                fill
                                className="object-cover"
                                style={{
                                    transform: `rotate(${imageRotate}deg)`,
                                    transition: "transform 0.3s ease",
                                }}
                            />
                        )}
                    </button>
                </div>

                {/* Song Info */}
                <div className="text-center">
                    <h3 className="text-lg font-bold text-white truncate">{currentSong.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{currentSong.description}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    {/* Prev */}
                    <button onClick={playPrev} className="text-gray-400 hover:text-white transition">
                        <BackwardIcon className="w-6 h-6" />
                    </button>

                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition shadow-lg"
                    >
                        {isPlaying ? (
                            <PauseIcon className="w-7 h-7" />
                        ) : (
                            <PlayIcon className="w-7 h-7 ml-1" />
                        )}
                    </button>

                    {/* Next */}
                    <button onClick={playNext} className="text-gray-400 hover:text-white transition">
                        <ForwardIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-center gap-6 pt-2">
                    {/* Favorite */}
                    <button
                        onClick={() => toggleFavorite({ ...currentSong, type: "song" })}
                        className={`transition ${
                            isFavorite(currentSong.id)
                                ? "text-red-500"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {isFavorite(currentSong.id) ? (
                            <HeartIconSolid className="w-6 h-6" />
                        ) : (
                            <HeartIcon className="w-6 h-6" />
                        )}
                    </button>

                    {/* List/Full Player */}
                    <button
                        onClick={onOpenFullPlayer}
                        className="text-gray-400 hover:text-white transition"
                        title="Show full queue"
                    >
                        <Bars3BottomLeftIcon className="w-6 h-6" />
                    </button>

                    {/* Collapse */}
                    <button
                        onClick={onCollapse}
                        className="text-gray-400 hover:text-white transition"
                        title="Collapse"
                    >
                        <ChevronDownIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
