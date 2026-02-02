"use client";

import { usePlayer } from "../context/PlayerContext";
import {
    PlayIcon, PauseIcon, ForwardIcon, BackwardIcon,
    ArrowDownTrayIcon, ArrowsRightLeftIcon, ArrowPathIcon
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BottomPlayer() {
    const { currentSong, isPlaying, togglePlay, playNext, playPrev, mode, toggleMode } = usePlayer();
    const pathname = usePathname();

    // Hide on pages that already have SidebarPlayer
    const hiddenPages = ["/home", "/search", "/favorites"];
    const isHidden = hiddenPages.some(page => pathname.startsWith(page));

    if (!currentSong || isHidden) return null;

    const handleDownload = () => {
        if (currentSong.url) {
            const link = document.createElement("a");
            link.href = currentSong.url;
            link.download = `${currentSong.title}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0E1730] border-t border-gray-800 p-3 z-50 flex items-center justify-between px-4 md:px-10 animate-slideUp shadow-2xl">

            {/* Song Info */}
            <div className="flex items-center gap-3 w-1/3 truncate">
                {currentSong.imageUri && (
                    <Image
                        src={currentSong.imageUri}
                        alt={currentSong.title}
                        width={50}
                        height={50}
                        className="rounded-md object-cover animate-spin-slow"
                        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                    />
                )}
                <div className="truncate">
                    <h4 className="text-white text-sm font-bold truncate">{currentSong.title}</h4>
                    <p className="text-gray-400 text-xs truncate">{currentSong.description}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 md:gap-6 justify-center w-1/3">
                {/* Prev */}
                <button onClick={playPrev} className="text-gray-400 hover:text-white transition">
                    <BackwardIcon className="w-6 h-6" />
                </button>

                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-lg"
                >
                    {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-1" />}
                </button>

                {/* Next */}
                <button onClick={playNext} className="text-gray-400 hover:text-white transition">
                    <ForwardIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-5 justify-end w-1/3">
                {/* Mode Toggle */}
                <button onClick={toggleMode} className={`transition ${mode !== 'normal' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`} title={`Mode: ${mode}`}>
                    {mode === 'repeat_one' ? <ArrowPathIcon className="w-5 h-5" /> : <ArrowsRightLeftIcon className="w-5 h-5" />}
                    {/* Optional Indicator for Repeart vs Shuffle manually handled by icon or tooltip */}
                </button>

                {/* Download */}
                <button onClick={handleDownload} className="text-gray-400 hover:text-white transition" title="Download">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
