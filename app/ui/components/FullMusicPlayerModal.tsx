"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import SidebarPlayer from "./SidebarPlayer";

export default function FullMusicPlayerModal({
    onClose,
}: {
    onClose: () => void;
}) {

    return (
        <div className="fixed inset-0 z-50 md:hidden bg-[#0f0f1a] flex flex-col">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-4 bg-[#0B1A33] border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Now Playing</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition text-white"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Music Player Content */}
            <div className="flex-1 overflow-auto pb-20">
                <div className="p-4">
                    <SidebarPlayer />
                </div>
            </div>
        </div>
    );
}
