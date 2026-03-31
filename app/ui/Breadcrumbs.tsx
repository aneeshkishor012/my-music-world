"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Split path: /search/songs -> ["", "search", "songs"]
    const segments = pathname.split("/").filter(Boolean);

    // Construct breadcrumb items
    const crumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        // Capitalize
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);

        return { label, href };
    });

    // Add Home at start? 
    // Usually Breadcrumbs are: Home > Search > Songs
    const allCrumbs = [{ label: "Home", href: "/home" }, ...crumbs];

    return (
        <div className="flex items-center text-sm text-gray-400 mb-4 px-4">
            {allCrumbs.map((crumb, idx) => {
                const isLast = idx === allCrumbs.length - 1;
                return (
                    <div key={crumb.href} className="flex items-center">
                        <Link
                            href={crumb.href}
                            className={`hover:text-white transition ${isLast ? "text-white font-semibold" : ""}`}
                        >
                            {crumb.label}
                        </Link>
                        {!isLast && <span className="mx-2 text-gray-600">/</span>}
                    </div>
                );
            })}
        </div>
    );
}
