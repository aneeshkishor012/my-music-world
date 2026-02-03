"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "antd";
import {
    EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useInfiniteMusic } from "../../hooks/useMusicData";
import { usePlayer } from "../../context/PlayerContext";

export default function MusicPlaylistScreen() {
    const { playList } = usePlayer();
    const [query, setQuery] = useState("Top English Songs"); // Default
    const [featuredTitle, setFeaturedTitle] = useState("Top Hits 2025");

    useEffect(() => {
        const storedPrefs = localStorage.getItem("userPreferences");
        if (storedPrefs) {
            try {
                const prefs = JSON.parse(storedPrefs);
                if (prefs.actors && prefs.actors.length > 0) {
                    setQuery(`Best of ${prefs.actors[0].name}`);
                    setFeaturedTitle(`Best of ${prefs.actors[0].name}`);
                } else if (prefs.languages && prefs.languages.length > 0) {
                    setQuery(`Top ${prefs.languages[0]} Songs`);
                    setFeaturedTitle(`Top ${prefs.languages[0]} Hits`);
                }
            } catch (e) {
                console.error("Error parsing prefs", e);
            }
        }
    }, []);

    const { data: songs, loading } = useInfiniteMusic(query);

    // Pick the first song as the "Banner" if available
    const bannerSong = songs.length > 0 ? songs[0] : null;

    return (
        <div className="text-white space-y-6">

            {/* Featured Album Card */}
            <Card
                className="bg-[#0E1730] rounded-xl p-0 m-0 shadow-lg border-none"
                variant="borderless"
            >
                {/* Banner Image */}
                <div className="w-full h-60 rounded-xl overflow-hidden relative bg-gray-800">
                    {bannerSong ? (
                        <Image
                            src={bannerSong.imageUri?.replace("150x150", "500x500") || bannerSong.imageUri} // Try to get higher res
                            alt="banner"
                            fill
                            sizes="(max-width: 1024px) 100vw, 800px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
                    )}
                    <Button
                        size="small"
                        className="absolute bottom-3 right-3 bg-white/20 text-white border-none backdrop-blur-md"
                    >
                        Listen Now
                    </Button>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold mt-4 text-white px-4">
                    {featuredTitle} 🎧
                </h2>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-gray-400 text-sm mt-2 px-4 pb-4">
                    <span>• {songs.length} songs</span>
                    <span>• Curated for you</span>
                </div>
            </Card>

            {/* Scrollable Song List */}
            <div
                className="space-y-3 max-h-[48vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#343F63] scrollbar-track-transparent"
            >
                {loading && <div className="text-center text-gray-500 py-4">Loading songs...</div>}

                {songs.map((song, index) => (
                    <div
                        key={`${song.id}-${index}`}
                        onClick={() => playList(songs, index)}
                        className="flex items-center justify-between bg-[#1A2340] pt-3 rounded-lg hover:bg-[#232F4D] transition group cursor-pointer"
                    >
                        {/* Left Section */}
                        <div className="flex items-center gap-3">
                            {/* Thumbnail */}
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-700">
                                {song.imageUri && (
                                    <Image
                                        src={song.imageUri}
                                        alt={song.title || "Song Thumbnail"}
                                        width={50}
                                        height={50}
                                        className="object-cover w-full h-full"
                                    />
                                )}
                            </div>

                            {/* Song Info */}
                            <div className="min-w-0">
                                <h4 className="font-semibold text-sm truncate max-w-[120px] sm:max-w-[150px] text-white">
                                    {song.title}
                                </h4>
                                <p className="text-gray-400 text-xs truncate max-w-[120px] sm:max-w-[150px]">
                                    {song.description || song.artist || "Unknown Artist"}
                                </p>
                            </div>
                        </div>

                        {/* Duration + Menu */}
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 text-sm">{song.duration ? `${song.duration}` : "--:--"}</span>
                            <EllipsisVerticalIcon className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
