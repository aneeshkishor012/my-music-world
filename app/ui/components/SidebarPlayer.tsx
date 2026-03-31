"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type React from 'react';
import {
    Bars3BottomLeftIcon,
    ChevronLeftIcon,
    CheckIcon,
    ArrowDownTrayIcon,
    HeartIcon as HeartIconSolid,
    HomeIcon,
    MusicalNoteIcon
} from "@heroicons/react/24/solid";
import { usePlayer } from "@/app/context/PlayerContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import PlayerControl from "@/app/ui/components/PlayerControl";
import { Button, FloatButton } from "antd";
import { HeartIcon } from "@heroicons/react/24/outline";
import SongSlider from "./SongsProgressBar";
// import type { FloatButtonProps } from "antd";
// import { PropsWithChildren } from "react";

const MyGroup = FloatButton.Group;

export default function SidebarPlayer({ onClose }: { onClose?: () => void }) {
    const { currentSong, isPlaying, togglePlay, playNext, playPrev, queue, currentIndex, playList, activeEntity } = usePlayer();


    const { toggleFavorite, isFavorite } = useFavorites();
    // const { Group } = FloatButton;
    // --- Size configuration (edit these values to change player image sizes) ---
    // Change `COVER_DIM_PX` to adjust the main cover image height/width (px).
    // Change `THUMB_SIZE_PX` to adjust small thumbnail width/height in the queue (px).
    const COVER_DIM_PX = 150; // default smaller size; reduce/increase as needed
    const THUMB_SIZE_PX = 26; // small queue thumbnails
    // -------------------------------------------------------------------------

    const queueRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLDivElement>(null);

    // Multi-select state
    const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());

    // Auto-scroll logic for Queue
    useEffect(() => {
        if (activeItemRef.current && !activeEntity) {
            activeItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [currentIndex, activeEntity]);

    const handleToggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = new Set(selectedSongs);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedSongs(next);
    };

    const handleSelectAll = () => {
        const list = queue;
        if (selectedSongs.size === list.length) {
            setSelectedSongs(new Set());
        } else {
            setSelectedSongs(new Set(list.map((s: any) => s.id)));
        }
    };

    const handleBulkFavorite = () => {
        const list = queue;
        list.forEach((s: any) => {
            if (selectedSongs.has(s.id) && !isFavorite(s.id)) {
                toggleFavorite({ ...s, type: "song" });
            }
        });
        setSelectedSongs(new Set());
    };

    const handleDownloadSelected = async () => {
        const list = queue;

        for (const s of list) {
            if (selectedSongs.has(s.id) && s.url) {

                if ((window as any).ReactNativeWebView) {
                    // Running inside React Native WebView
                    (window as any).ReactNativeWebView.postMessage(
                        JSON.stringify({
                            type: "download",
                            url: s.url,
                            filename: `${s.title || "song"}.mp3`
                        })
                    );
                } else {
                    // Normal browser download
                    const response = await fetch(s.url);
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = `${s.title || "song"}.mp3`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                }
            }
        }

        setSelectedSongs(new Set());
    };


    const emptyQuotes = [
        "Silence is waiting for your first song.",
        "Your playlist is empty… let the music begin.",
        "No tracks lined up yet. Start the vibe.",
        "Music is missing. Let’s fix that.",
        "Queue empty. Discover something beautiful.",
        "Every playlist starts with one song.",
        "Tap a track and let the journey start.",
        "Nothing playing… time to press play.",
        "Your next favorite song is waiting.",
        "Let the music fill this space."
    ];

    const randomQuote = emptyQuotes[Math.floor(Math.random() * emptyQuotes.length)];


    if (!currentSong && queue.length === 0 && !activeEntity) {
        return (
            <div className="hidden lg:flex w-full flex-col items-center justify-center  rounded-xl lg:rounded-2xl p-4 lg:p-6 h-full border border-white/5 text-gray-500">
                <Bars3BottomLeftIcon className="w-10 h-10 lg:w-12 lg:h-12 mb-4 opacity-20" />
                <h1 className="text-center text-xs lg:text-xl font-bold italic">{randomQuote}</h1>
            </div>
        );
    }

    const renderFloatButtons = () => {
        if (selectedSongs.size === 0) return null;

        return (
            <MyGroup
                trigger="click"
                type="primary"
                style={{ right: 50 }}
                placement="top"
                icon={<MusicalNoteIcon />}
                children={[
                    <FloatButton
                        key="download"
                        icon={<ArrowDownTrayIcon />}
                        onClick={handleDownloadSelected}
                    />,
                    <FloatButton
                        key="fav"
                        icon={<HeartIconSolid />}
                        onClick={handleBulkFavorite}
                    />,
                ]}
            />
        );
    };


    const displaySongs = queue;
    const title = activeEntity ? activeEntity.name || activeEntity.title : "Now Playing";
    const subTitle = activeEntity ? `${activeEntity.type} • ${displaySongs.length} Songs` : "Queue";
    return (
        <div className="flex flex-col rounded-xl lg:rounded-2xl h-full w-full border border-white/10 shadow-2xl overflow-hidden relative bg-[rgb(12,20,55)] lg:bg-transparent backdrop-blur-2xl">
            {/* Close icon for mobile (only if onClose is provided) */}
            {/* Floating Selected Songs Header */}
            <div className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-12 transition-all duration-300 ${selectedSongs.size > 0 ? "backdrop-blur-xl " : "backdrop-blur-none"}`}>

                {/* Left Side - Back Button (Always Visible) */}
                {onClose ? (
                    <Button
                        icon={<ChevronLeftIcon className="w-5 h-5" />}
                        onClick={onClose}
                        variant="text"
                        className="border-none rounded-lg hover:!bg-white/10 bg-transparent text-white flex items-center justify-center transition-all duration-300"
                    />
                ) : (
                    <div className="w-10" />
                )}

                {/* Center Text (Only When Selected) */}
                <h1 className={`text-sm font-semibold transition-opacity duration-300 ${selectedSongs.size > 0 ? "opacity-100 text-purple-300" : "opacity-0"}`}>
                    Selected {selectedSongs.size} Songs
                </h1>

                {/* Right Spacer (Keeps Center Alignment Perfect) */}
                <div className="w-10" />

            </div>



            {/* ENTITY DETAILS (if any) */}
            {activeEntity && (
                <div className="flex flex-col items-center p-3 border-b border-white/10 relative">
                    <div className={`relative shadow-lg ${activeEntity.type === 'artist' ? 'rounded-full' : 'rounded-lg'} overflow-hidden mb-2`} style={{ width: 100, height: 100 }}>
                        <Image
                            src={activeEntity.imageUri || (activeEntity.image?.[2]?.url) || ""}
                            alt={title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <h2 className="text-lg font-bold text-white leading-tight truncate">{title}</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{subTitle}</p>
                </div>
            )}
            {currentSong && !activeEntity && (
                <div className="relative flex flex-col  rounded-xl lg:rounded-2xl items-center p-3 border-b border-white/10 overflow-hidden">
                    {/* Cover */}
                    <div
                        className="relative shadow-lg rounded-lg overflow-hidden mb-2 lg:mt-0 mt-2"
                        style={{ width: 200, height: 200 }}
                    >
                        <Image
                            src={currentSong.imageUri || ""}
                            alt={currentSong.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-white leading-tight truncate">
                        {currentSong.title || currentSong?.name}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 mb-2">
                        {currentSong.description || currentSong?.label}
                    </p>
                    <SongSlider />

                    {/* Controls Row */}
                    <div className="flex items-center gap-2 pl-2 pr-2 justify-between w-full">

                        {/* Select all */}
                        <div
                            onClick={() => handleSelectAll()}
                            className={`w-5 h-5 lg:w-7 lg:h-7 rounded border flex items-center justify-center shrink-0 transition-colors ${selectedSongs.size === queue.length
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-600"
                                }`}
                        >
                            {selectedSongs.size === queue.length && (
                                <CheckIcon className="w-3 h-3 text-white" />
                            )}
                        </div>
                        {/* Player controls */}
                        <PlayerControl
                            isPlaying={isPlaying}
                            togglePlay={togglePlay}
                            playNext={playNext}
                            playPrev={playPrev}
                        />

                        {/* Favorite */}
                        <div className="opacity-100 transition-opacity">
                            <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    toggleFavorite({ ...currentSong, type: "song" });
                                }}

                                className="p-1 hover:text-red-500 text-gray-500 transition"
                            >
                                {isFavorite(currentSong.id) ? (
                                    <HeartIconSolid className="w-8 h-8 lg:w-7 lg:h-7 text-red-500" />
                                ) : (
                                    <HeartIcon className="w-8 h-8 lg:w-7 lg:h-7" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* SONG LIST */}
            <div className="flex-1  rounded-xl lg:rounded-2xl mt-2 min-h-0 flex flex-col p-2 lg:p-3 pt-0">
                <div
                    ref={queueRef}
                    className="flex-1 overflow-y-auto pr-1 lg:pr-2 space-y-1 lg:space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                >
                    {displaySongs.map((song: any, idx: number) => {
                        const isActive = idx === currentIndex;
                        const isSelected = selectedSongs.has(song.id);
                        return (
                            <div
                                key={`${song.id}-${idx}`}
                                ref={isActive ? activeItemRef : null}
                                onClick={() => playList(displaySongs, idx)}
                                className={`flex items-center gap-2 lg:gap-3 pl-2 pr-2 pt-3 pb-3  rounded-lg transition overflow-hidden cursor-pointer group relative ${isActive ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                {/* Selection Indicator */}
                                <div
                                    onClick={(e: React.MouseEvent) => handleToggleSelect(song.id, e)}
                                    className={`w-4 h-4 lg:w-5 lg:h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-gray-400'}`}
                                >
                                    {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                                </div>
                                <div className="w-6 text-center text-gray-500 mr-0 group-hover:text-white">
                                    <span >{idx + 1}</span>
                                </div>
                                <div
                                    className="relative rounded overflow-hidden shrink-0"
                                    style={{ width: `${THUMB_SIZE_PX}px`, height: `${THUMB_SIZE_PX}px` }}
                                >
                                    <Image
                                        src={song.imageUri || ""}
                                        alt={song.title}
                                        fill
                                        sizes={`${THUMB_SIZE_PX}px`}
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {isActive && isPlaying && (
                                        <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                                            <div className="flex gap-0.5 items-end h-3">
                                                <div className="w-0.5 bg-white animate-bounce h-2"></div>
                                                <div className="w-0.5 bg-white animate-bounce h-3 delay-75"></div>
                                                <div className="w-0.5 bg-white animate-bounce h-1.5 delay-150"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-xs lg:text-sm font-semibold truncate ${isActive ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>
                                        {song.title || song.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {song.description || song.label}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500 ml-4">
                                    {song.duration || "--:--"}
                                </div>
                                <div className="opacity-100 transition-opacity">
                                    <button
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            toggleFavorite({ ...song, type: "song" });
                                        }}
                                        className="p-1 hover:text-red-500 text-gray-500 transition"
                                    >
                                        {isFavorite(song.id) ? <HeartIconSolid className="w-6 h-6 lg:w-4 lg:h-6 text-red-500" /> : <HeartIcon className="w-3 h-3 lg:w-4 lg:h-4" />}
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CURRENT PLAYING SONG DETAILS (always at bottom) */}
            {currentSong && activeEntity && (
                <div className="border-t border-white/10 bg-[#10182A] p-3 flex items-center gap-3">
                    <div className="relative rounded overflow-hidden" style={{ width: 40, height: 40 }}>
                        <Image
                            src={currentSong.imageUri || ""}
                            alt={currentSong.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate text-white">{currentSong.title}</p>
                        <p className="text-xs text-gray-400 truncate">{currentSong.description}</p>
                    </div>
                    <PlayerControl isPlaying={isPlaying} togglePlay={togglePlay} playNext={playNext} playPrev={playPrev} />
                </div>
            )}

            {renderFloatButtons()}
        </div>
    );
}
