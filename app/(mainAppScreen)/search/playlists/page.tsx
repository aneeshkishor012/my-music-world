"use client";

import { useSearchParams } from "next/navigation";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";
import Breadcrumbs from "@/app/ui/components/Breadcrumbs";
import { ResuableSearchSection } from "@/app/ui/components/SearchSection";
import { Suspense } from "react";

function PlaylistsSearchContent() {
    const searchParams = useSearchParams();
    const q = searchParams?.get("q") || "";

    return (
        <div className="flex flex-row gap-6 h-full w-full">
            {/* LEFT CONTENT – 70% */}
            <div className="flex-1 bg-[#0e1730] overflow-hidden p-3 min-w-0 rounded-xl h-full pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <Breadcrumbs items={[{ label: 'Search', href: `/home?q=${encodeURIComponent(q)}` }, { label: 'Playlists' }]} />

                <p className="text-sm text-gray-400 mb-6 px-1">Results for "{q}"</p>

                <ResuableSearchSection title="Playlists" type="playlist" query={q} limit={24} showPagination={false} infinite={true} />
            </div>

            {/* RIGHT SIDEBAR – 30% */}
            <div className="w-[350px] shrink-0 h-full">
                <SidebarPlayer />
            </div>
        </div>
    );
}

export default function PlaylistsSearchPage() {
    return (
        <div className="h-full text-white pl-3  pb-2">
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading playlists...</div>}>
                <PlaylistsSearchContent />
            </Suspense>
        </div>
    );
}
