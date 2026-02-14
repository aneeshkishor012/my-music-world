"use client";

import { useState, ReactNode, FC, useEffect } from "react";
import { usePathname } from "next/navigation";
import BottomNavBar from "./BottomNavBar";
import FloatingMiniPlayer from "./FloatingMiniPlayer";
import BottomControlPanel from "./BottomControlPanel";
import FullMusicPlayerModal from "./FullMusicPlayerModal";

interface MobileUIWrapperProps {
    children?: ReactNode;
}

// Listen for a custom event to open the full player modal
const MobileUIWrapper: FC<MobileUIWrapperProps> = ({ children }) => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handler = () => setIsFullPlayerOpen(true);
        window.addEventListener("openFullPlayerModal", handler);
        return () => window.removeEventListener("openFullPlayerModal", handler);
    }, []);

    return (
        <>
            {/* Main Content */}
            {children}

            {/* Mobile UI Components - Only visible on mobile */}
            <div className="md:hidden">
                {/* Floating Mini Player */}
                <FloatingMiniPlayer onExpand={() => setIsPanelExpanded(true)} />

                {/* Bottom Control Panel */}
                {isPanelExpanded && (
                    <BottomControlPanel
                        onCollapse={() => setIsPanelExpanded(false)}
                        onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
                    />
                )}

                {/* Full Screen Player Modal */}
                {isFullPlayerOpen && (
                    <FullMusicPlayerModal onClose={() => setIsFullPlayerOpen(false)} />
                )}

                {/* Bottom Navigation Bar */}
                {pathname !== "/welcome" && <BottomNavBar />}
            </div>
        </>
    );
};

export default MobileUIWrapper;
