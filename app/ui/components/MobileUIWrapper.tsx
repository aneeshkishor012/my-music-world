"use client";

import { useState, ReactNode, FC } from "react";
import BottomNavBar from "./BottomNavBar";
import FloatingMiniPlayer from "./FloatingMiniPlayer";
import BottomControlPanel from "./BottomControlPanel";
import FullMusicPlayerModal from "./FullMusicPlayerModal";

interface MobileUIWrapperProps {
    children: ReactNode;
}

const MobileUIWrapper: FC<MobileUIWrapperProps> = ({ children }) => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);
    const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

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
