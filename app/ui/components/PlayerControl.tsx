import { ForwardIcon, BackwardIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import React from 'react'

export default function playerControl(props: any) {
    const { isPlaying, togglePlay, playNext, playPrev } = props;
    return (
        <div className="flex items-center justify-center gap-6">
            <button onClick={playPrev} className="text-gray-400 hover:text-white transition transform active:scale-90">
                <BackwardIcon className="w-8 h-8" />
            </button>
            <button onClick={togglePlay} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transform active:scale-95 transition">
                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-0.5" />}
            </button>
            <button onClick={playNext} className="text-gray-400 hover:text-white transition transform active:scale-90">
                <ForwardIcon className="w-8 h-8" />
            </button>
        </div>
    )
}
