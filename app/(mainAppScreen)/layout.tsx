"use client";

import SideNav from "@/app/ui/components/sidenav";
import { ArrowLeftEndOnRectangleIcon, BellIcon, Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import MobileUIWrapperClient from "@/app/ui/components/MobileUIWrapperClient";
import { PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Layout({ children }: PropsWithChildren) {
    const { data: session } = useSession();
    const [greeting, setGreeting] = useState("Greetings");

    const userMenuItems: MenuProps["items"] = [
        {
            key: "settings",
            icon: <Cog6ToothIcon />,
            label: (
                <Link href="/settings" className="flex items-center gap-2">
                    Settings
                </Link>
            ),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <ArrowLeftEndOnRectangleIcon />,
            label: "Logout",
            danger: true,
            onClick: () => signOut(),
        },
    ];


    useEffect(() => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) setGreeting("Good Morning");
        else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
        else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
        else setGreeting("Greetings");
    }, []);

    const userName = session?.user?.name || "User";

    return (
        <div className="relative flex flex-col h-screen overflow-hidden">

            {/* Premium Background */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-[rgb(30,27,75)] via-[rgb(5,11,36)] to-black" /> */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(45,40,95)] via-[rgb(12,20,55)] to-[rgb(10,10,20)]" />
            {/* <div className="absolute inset-0 bg-gradient-to-br from-[rgb(60,50,130)] via-[rgb(20,25,70)] to-[rgb(15,15,30)]" /> */}


            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col flex-1 overflow-hidden">

                <div className="flex flex-1 overflow-hidden">

                    {/* Desktop Sidebar */}
                    <div className="hidden md:flex md:w-15 flex-none backdrop-blur-2xl border border-white/10 rounded-xl ml-2 mb-1 mt-2">
                        <SideNav />
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col flex-1 overflow-hidden">

                        {/* Navbar */}
                        <nav className="backdrop-blur-2xl border border-white/10 text-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-between m-2 mb-0 rounded-xl">
                            <h1 className="text-lg font-semibold truncate tracking-wide">
                                {greeting}, {userName}
                            </h1>

                            <div className="flex items-center gap-4">
                                <button className="hover:text-purple-400 transition p-1">
                                    <BellIcon className="w-6 h-6" />
                                </button>

                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    trigger={["click"]}
                                    placement="bottomRight"
                                >
                                    <button className="hover:text-purple-400 transition p-1">
                                        <UserCircleIcon className="w-7 h-7" />
                                    </button>
                                </Dropdown>
                            </div>
                        </nav>

                        {/* Page Content */}
                        <main className="flex-1 flex flex-col overflow-hidden m-2 rounded-xl backdrop-blur-2xl border border-white/10">

                            <div className="flex-1 overflow-auto">
                                <MobileUIWrapperClient>
                                    {children}
                                </MobileUIWrapperClient>
                            </div>

                        </main>

                    </div>
                </div>

                {/* Footer */}
                <footer className="backdrop-blur-2xl border-t border-white/10 text-gray-400 text-center py-2 text-xs sm:text-sm m-2 mt-0 rounded-xl">
                    © {new Date().getFullYear()} My Music App — All Rights Reserved.
                </footer>

            </div>
        </div>
    );

}
