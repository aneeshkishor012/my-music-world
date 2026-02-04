import { Suspense } from "react";
import SongCategoryScreen from "./SongCategoryScreen";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";

export default function HomePage() {
    return (
        <div className="h-full bg-[#12121F] text-white p-2 overflow-hidden">
            <div className="flex flex-row h-full w-full">

                {/* LEFT CONTENT – 70% */}
                <div className="flex-1 min-w-0 h-full overflow-hidden pr-2">
                    <Suspense fallback={<div className="animate-pulse bg-gray-800/50 rounded-xl h-20 w-full" />}>
                        <SongCategoryScreen />
                    </Suspense>
                </div>

                {/* RIGHT SIDEBAR – 30% */}
                <div className="w-[350px] shrink-0 h-full">
                    <SidebarPlayer />
                </div>
            </div>
        </div>
    );
}
