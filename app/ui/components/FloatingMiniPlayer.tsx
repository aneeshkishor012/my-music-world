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
            className="fixed bottom-32 left-4 z-30 md:hidden"
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
                        // className={`object-cover ${isPlaying ? "animateSpinSlow" : ""}`}
                        className="animate-spin"
                        style={{
                            animationDuration: "6s",
                            animationPlayState: isPlaying ? "running" : "paused",
                        }}
                        unoptimized
                    />
                )}
            </button>
        </div>
    );
}
