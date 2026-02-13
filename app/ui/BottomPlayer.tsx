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
        <div className="fixed bottom-0 left-0 right-0 bg-[#0E1730] border-t border-gray-800 p-1.5 sm:p-2 md:p-3 z-50 hidden md:flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 md:px-10 animate-slideUp shadow-2xl">

            {/* Song Info */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-1/3 truncate">
                {currentSong.imageUri && (
                    <Image
                        src={currentSong.imageUri}
                        alt={currentSong.title}
                        width={40}
                        height={40}
                        className="rounded-md object-cover animate-spin-slow flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12"
                        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                        unoptimized
                    />
                )}
                <div className="truncate min-w-0">
                    <h4 className="text-white text-xs sm:text-sm font-bold truncate">{currentSong.title}</h4>
                    <p className="text-gray-400 text-xs truncate">{currentSong.description}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-6 justify-center w-full sm:w-1/3">
                {/* Prev */}
                <button onClick={playPrev} className="text-gray-400 hover:text-white transition p-1">
                    <BackwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-lg flex-shrink-0"
                >
                    {isPlaying ? <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />}
                </button>

                {/* Next */}
                <button onClick={playNext} className="text-gray-400 hover:text-white transition p-1">
                    <ForwardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-5 justify-end w-full sm:w-1/3">
                {/* Mode Toggle */}
                <button onClick={toggleMode} className={`transition p-1 ${mode !== 'normal' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`} title={`Mode: ${mode}`}>
                    {mode === 'repeat_one' ? <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowsRightLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>

                {/* Download */}
                <button onClick={handleDownload} className="text-gray-400 hover:text-white transition p-1" title="Download">
                    <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    );
}
