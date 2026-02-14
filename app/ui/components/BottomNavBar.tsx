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
        <nav
            className="
      fixed bottom-0 left-0 right-0
      z-50
      md:hidden
      flex items-center justify-around
      px-4 py-3
      backdrop-blur-2xl
      bg-[#0b1120]/90
      border-t border-white/10
      shadow-[0_-8px_30px_rgba(0,0,0,0.6)]
    "
        >
            {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                    item.href === "/home"
                        ? pathname === "/home"
                        : item.href === pathname ||
                        pathname.startsWith(item.href + "/");

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
            flex flex-col items-center justify-center
            p-2 rounded-xl
            transition-all duration-300
            ${active
                                ? `
                  text-purple-400
                  bg-gradient-to-r
                  from-purple-600/20
                  via-indigo-600/20
                  to-blue-600/20
                  shadow-[0_0_20px_rgba(139,92,246,0.6)]
                  scale-105
                `
                                : `
                  text-gray-400
                  hover:text-white
                `
                            }
          `}
                    >
                        <Icon className="w-6 h-6" />
                    </Link>
                );
            })}
        </nav>
    );

}
