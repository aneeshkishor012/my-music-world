"use client";

import { usePlayer } from "@/app/context/PlayerContext";
import Image from "next/image";
import { useState } from "react";

export default function FloatingMiniPlayer({ onExpand }: { onExpand: () => void }) {
    const { currentSong, isPlaying } = usePlayer();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    if (!currentSong) return null;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="fixed bottom-20 left-4 z-30 md:hidden"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <button
                onClick={onExpand}
                onMouseDown={handleMouseDown}
                className="relative w-16 h-16 rounded-full shadow-2xl overflow-hidden group cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            >
                {currentSong.imageUri && (
                    <Image
                        src={currentSong.imageUri}
                        alt={currentSong.title}
                        fill
                        className={`object-cover ${isPlaying ? "animate-spin-slow" : ""}`}
                        style={{
                            animationPlayState: isPlaying ? "running" : "paused",
                        }}
                    />
                )}

                {/* Playing Indicator */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                        {isPlaying ? (
                            <div className="flex gap-1 items-end h-3">
                                <div className="w-0.5 bg-white animate-bounce h-2"></div>
                                <div className="w-0.5 bg-white animate-bounce h-3 delay-75"></div>
                                <div className="w-0.5 bg-white animate-bounce h-1.5 delay-150"></div>
                            </div>
                        ) : (
                            <div className="text-white text-2xl flex items-center justify-center">▶</div>
                        )}
                    </div>
                </div>
            </button>
        </div>
    );
}
