"use client";

import { useState, ReactNode, FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface MobileNavProps {
    children: ReactNode;
}

const MobileNav: FC<MobileNavProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* Mobile/Tablet SideBar - Hidden on Desktop, Toggle on Mobile */}
            <div className={`
                absolute left-0 top-0 bottom-0 z-40 
                bg-[#0b1a33] text-white border-r border-white/10 rounded-r-xl
                transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'w-20 sm:w-24' : 'w-0'}
                md:static md:w-16 md:flex-none md:rounded-xl md:m-1 md:mb-1
                overflow-hidden
            `}>
                {children}
                {/* Close button on mobile */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-2 md:hidden text-gray-400 hover:text-white p-1"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="absolute inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Menu Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed bottom-20 md:bottom-24 left-3 z-30 md:hidden p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition"
                title={sidebarOpen ? "Close menu" : "Open menu"}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </>
    );
};

export default MobileNav;
