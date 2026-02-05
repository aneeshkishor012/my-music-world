"use client";

import { useState, ReactNode, FC } from "react";
import BottomNavBar from "./BottomNavBar";
import FloatingMiniPlayer from "./FloatingMiniPlayer";
import BottomControlPanel from "./BottomControlPanel";
import FullMusicPlayerModal from "./FullMusicPlayerModal";

interface MobileUIWrapperProps {
    children?: ReactNode;
}


import { useEffect } from "react";

// Listen for a custom event to open the full player modal
const MobileUIWrapper: FC<MobileUIWrapperProps> = ({ children }) => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

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
                <BottomNavBar />
            </div>
        </>
    );
};

export default MobileUIWrapper;
