"use client";

import SidebarPlayer from "./SidebarPlayer";

export default function FullMusicPlayerModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-50 md:hidden bg-[#0E1730] flex flex-col shadow-2xl border-l border-white/10 animate-slideInRight">
            {/* Header with Close Button */}
            {/* <div className="flex items-center justify-between p-4 bg-[#0B1A33] border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Player Queue</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition text-white"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div> */}

            {/* Music Player Content */}
            <div className="flex-1 overflow-y-auto pb-0">
                <SidebarPlayer onClose={onClose} />
            </div>
        </div>
    );
}
