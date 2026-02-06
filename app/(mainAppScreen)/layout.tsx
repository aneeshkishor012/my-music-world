"use client";

import SideNav from "@/app/ui/components/sidenav";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import MobileUIWrapperClient from "@/app/ui/components/MobileUIWrapperClient";
import { PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Layout({ children }: PropsWithChildren) {
    const { data: session } = useSession();
    const [greeting, setGreeting] = useState("Greetings");

    useEffect(() => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) setGreeting("Good Morning");
        else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
        else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
        else setGreeting("Greetings");
    }, []);

    const userName = session?.user?.name || "User";

    return (
        <div className="flex flex-col h-screen bg-[#0f0f1a] overflow-hidden">

            {/* Top Navbar - Responsive */}
            <nav className="bg-[#0B1A33] text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 shadow-lg flex items-center justify-between m-1 sm:m-2 rounded-lg sm:rounded-xl flex-shrink-0">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold truncate">
                    {greeting}, {userName}
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <button className="hover:text-purple-300 transition p-1">
                        <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    </button>

                    <button className="hover:text-purple-300 transition p-1">
                        <UserCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </button>
                </div>
            </nav>

            {/* Main Wrapper */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Desktop SideBar */}
                <div className="hidden md:flex md:w-16 md:flex-none bg-[#0b1a33] text-white border-r border-white/10 rounded-xl md:m-1 md:mb-1">
                    <SideNav />
                </div>

                {/* Page Content */}
                <main className="flex-grow overflow-auto w-full md:pr-2 md:pb-2 pb-0 md:pb-0 relative">
                    <MobileUIWrapperClient>
                        {children}
                    </MobileUIWrapperClient>
                </main>
            </div>

            {/* Footer - Responsive */}
            <footer className="w-full bg-[#0B1A33] text-gray-300 text-center py-2 sm:py-3 text-xs sm:text-sm mt-auto flex-shrink-0">
                © {new Date().getFullYear()} My Music App — All Rights Reserved.
            </footer>
        </div>
    );
}
