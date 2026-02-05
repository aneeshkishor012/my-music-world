
import { Suspense } from "react";
import SongCategoryScreen from "./SongCategoryScreen";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";

export default function HomePage() {
    return (
        <div className="h-full bg-[#12121F] text-white p-1 sm:p-2 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full w-full gap-1 sm:gap-2">
                {/* LEFT CONTENT – Full width on mobile, 70% on desktop */}
                <div className="flex-1 min-w-0 h-full overflow-hidden">
                    <div className="bg-[#0E1730] rounded-lg sm:rounded-xl p-1 sm:p-2 h-full overflow-hidden">
                        <Suspense fallback={<div className="animate-pulse bg-gray-800/50 rounded-xl h-20 w-full" />}>
                            <SongCategoryScreen />
                        </Suspense>
                    </div>
                </div>
                {/* RIGHT SIDEBAR – Hidden on mobile, visible on desktop */}
                <div className="hidden lg:flex w-full lg:w-[350px] xl:w-[400px] 2xl:w-[450px] h-full flex-shrink-0">
                    <SidebarPlayer />
                </div>
            </div>
        </div>
    );
}
