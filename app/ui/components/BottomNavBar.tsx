"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, MagnifyingGlassIcon, HeartIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export default function BottomNavBar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname.startsWith(path);
    };

    const navItems = [
        { href: "/home/suggestions", icon: HomeIcon, label: "Home" },
        { href: "/home", icon: MagnifyingGlassIcon, label: "Search" },
        { href: "/favorites", icon: HeartIcon, label: "Favorites" },
        { href: "/settings", icon: Cog6ToothIcon, label: "Settings" },
    ];

    return (
        <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] z-40 md:hidden flex items-center justify-around px-4 py-3 rounded-2xl  bg-blue/10 backdrop-blur-xl border border-blue-950  shadow-[0_8px_30px_rgba(0,0,0,0.4)] ">
            {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                    item.href === "/home"
                        ? pathname === "/home"
                        : item.href === pathname || pathname.startsWith(item.href + "/");

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={` p-3 rounded-xl transition-all duration-300  ${active ? "text-blue-500 bg-blue/10 shadow-[0_0_10px_rgba(96,165,250,0.6)]" : "text-gray-300 hover:text-white"} `}
                        title={item.label}
                    >
                        <Icon className="w-6 h-6" />
                    </Link>
                );
            })}
        </nav>

    );
}
