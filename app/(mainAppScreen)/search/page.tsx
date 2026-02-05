"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function SearchContent() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search/songs?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-1 sm:gap-2 h-full w-full">
            {/* LEFT CONTENT – Full width on mobile, 70% on desktop */}
            <div className="flex-1 bg-[#0e1730] overflow-hidden p-2 sm:p-3 min-w-0 rounded-lg sm:rounded-xl h-full pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {/* Search Input */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search songs, artists, albums, playlists..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1A2A4A] text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Empty State */}
                {!searchQuery && (
                    <div className="flex flex-col items-center justify-center text-gray-500 opacity-80 py-16">
                        <MagnifyingGlassIcon className="w-16 h-16 mb-4 text-gray-600" />
                        <p className="text-center text-lg font-medium">Start searching</p>
                        <p className="text-center text-sm mt-1">Enter a song, artist, album, or playlist name</p>
                    </div>
                )}
            </div>

            {/* RIGHT SIDEBAR – Hidden on mobile, 30% on desktop */}
            <div className="hidden lg:flex lg:w-[350px] xl:w-[400px] 2xl:w-[450px] h-full flex-shrink-0">
                <SidebarPlayer />
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="h-full text-white p-1 sm:p-2 pb-2">
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}
