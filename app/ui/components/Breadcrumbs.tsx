"use client";

import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/solid";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className="flex items-center space-x-2 text-gray-400 text-sm mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/home/suggestions" className="hover:text-white transition flex items-center">
                <HomeIcon className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRightIcon className="w-4 h-4 text-gray-600 shrink-0" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-white transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-blue-400 font-medium truncate max-w-[200px]">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
