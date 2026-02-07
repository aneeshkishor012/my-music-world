"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";
import Breadcrumbs from "@/app/ui/components/Breadcrumbs";
import { ResuableSearchSection } from "@/app/ui/components/SearchSection";
import { Suspense } from "react";
import { usePlayer } from "@/app/context/PlayerContext";

function SongsSearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { playList } = usePlayer();
    const q = searchParams?.get("q") || "";
    const returnUrl = searchParams?.get("return");
    const backLabel = returnUrl ? "Suggestions" : "Search";
    const backHref = returnUrl ? returnUrl : `/home?q=${encodeURIComponent(q)}`;

    const handleItemClick = (data: [], item: any, index: number) => {
        if (item?.type === "song") {
            // Queue the entire list
            playList(data, index);
        } else {
            router.push(
                `/home/${item.type}/${item.id}?item=${encodeURIComponent(
                    JSON.stringify(item)
                )}`
            );
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-1 sm:gap-2 h-full w-full">
            {/* LEFT CONTENT – Full width on mobile, 70% on desktop */}
            <div className="flex-1 bg-[#0e1730] overflow-hidden p-2 sm:p-3 min-w-0 rounded-lg sm:rounded-xl h-full pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <Breadcrumbs items={[{ label: backLabel, href: backHref }, { label: 'Songs' }]} />

                <p className="text-xs sm:text-sm text-gray-400 mb-3 md:mb-6 px-1 sm:px-2">Results for "{q}"</p>

                <ResuableSearchSection
                    title="Songs"
                    type="song"
                    query={q}
                    limit={24}
                    showPagination={false}
                    infinite={true}
                    maxItems={null}
                    handleItemClick={handleItemClick}
                />
            </div>

            {/* RIGHT SIDEBAR – Hidden on mobile, 30% on desktop */}
            <div className="hidden lg:flex lg:w-[350px] xl:w-[400px] 2xl:w-[450px] h-full flex-shrink-0">
                <SidebarPlayer />
            </div>
        </div>
    );
}

export default function SongsSearchPage() {
    return (
        <div className="h-full text-white p-1 sm:p-2 pb-2">
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading songs...</div>}>
                <SongsSearchContent />
            </Suspense>
        </div>
    );
}
