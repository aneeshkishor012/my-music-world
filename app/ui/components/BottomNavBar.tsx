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
        <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0B1A33] border-t border-white/10 px-3 py-3 flex items-center justify-around">
            {navItems.map((item) => {
                const Icon = item.icon;
                // Special handling for Search icon which should only match exactly /home
                const active = item.href === "/home" 
                    ? pathname === "/home"
                    : (item.href === pathname || pathname.startsWith(item.href + "/"));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                            active
                                ? "text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]"
                                : "text-gray-400 hover:text-white"
                        }`}
                        title={item.label}
                    >
                        <Icon className="w-6 h-6" />
                    </Link>
                );
            })}
        </nav>
    );
}
