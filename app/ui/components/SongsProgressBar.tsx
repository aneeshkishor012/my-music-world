"use client";

import { Slider } from "antd";
import { usePlayer } from "../../context/PlayerContext";
import { useEffect, useState } from "react";

export default function SongSlider() {
    const { currentSong, currentTime, duration, seek } = usePlayer();
    const [sliderValue, setSliderValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!isDragging) {
            setSliderValue(currentTime);
        }
    }, [currentTime, isDragging]);

    if (!currentSong) return null;

    const formatTime = (seconds: number) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleOnChange = (val: number) => {
        setIsDragging(true);
        setSliderValue(val);
    };

    const handleOnAfterChange = (val: number) => {
        seek(val);
        setIsDragging(false);
    };

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <div className="flex items-center gap-3">
                
                {/* Current Time */}
                <span className="text-xs font-mono text-gray-400 w-10 text-right">
                    {formatTime(sliderValue)}
                </span>

                {/* Slider */}
                <div className="flex-1 curved-slider">
                    <Slider
                        min={0}
                        max={duration || 0}
                        value={sliderValue}
                        onChange={handleOnChange}
                        onAfterChange={handleOnAfterChange}
                        tooltip={{
                            formatter: (value) => formatTime(Number(value)),
                        }}
                        styles={{
                            track: { backgroundColor: "#22c55e" },
                            rail: { backgroundColor: "#374151" },
                        }}
                    />
                </div>

                {/* Duration */}
                <span className="text-xs font-mono text-gray-400 w-10 text-left">
                    {formatTime(duration)}
                </span>
            </div>
        </div>
    );
}
