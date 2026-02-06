"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "antd";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

// Import the Search Section Component
import { ResuableSearchSection } from "../../ui/components/SearchSection";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlayer } from "@/app/context/PlayerContext";

export default function SongCategoryScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playList } = usePlayer();
    const qParam = searchParams.get("q") ?? "";
    const restore = searchParams.get("restore") === "1";
    const initialQuery = qParam;
    const fromSuggestions = searchParams.get("from") === "suggestions";

    const [categories, setCategories] = useState<string[]>([
        "Tamil", "Malayalam", "Kannada", "Relax", "Romance",
        "Sad", "Sleep", "Dance", "Trending", "Party", "Devotional"
    ]);

    const [localQuery, setLocalQuery] = useState(initialQuery);

    // Home configuration (code-only): set to a number to limit initial songs,
    // or `null` to enable infinite scroll on Home.
    const HOME_INITIAL_SONG_COUNT: number | null = 14; // <-- change here to configure

    // Debounce Search
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Persist last non-empty query (so returning from Suggestions doesn't clear Search)
    useEffect(() => {
        const next = debouncedQuery.trim();
        if (!next) return;

        try {
            sessionStorage.setItem("lastSearchQuery", next);
        } catch {
            // ignore
        }
    }, [debouncedQuery]);

    // Restore last query when navigating back to Search without a query
    useEffect(() => {
        if (qParam) return; // URL query wins
        if (searchParams.has("q") && !restore) return; // explicit empty query

        let saved = "";
        try {
            saved = sessionStorage.getItem("lastSearchQuery") || "";
        } catch {
            saved = "";
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete("restore");

        if (!saved) {
            if (restore) {
                const next = params.toString();
                router.replace(next ? `?${next}` : "/home");
            }
            return;
        }

        params.set("q", saved);
        router.replace(`?${params.toString()}`);
    }, [qParam, restore, router, searchParams]);

    // Sync local state from URL (single source of truth)
    useEffect(() => {
        setLocalQuery(initialQuery);
        setDebouncedQuery(initialQuery);
    }, [initialQuery]);

    const resultsScrollRef = useRef<HTMLDivElement | null>(null);

    // Reset scroll position when navigating from Suggestions -> Search
    useEffect(() => {
        if (!fromSuggestions) return;
        if (!debouncedQuery) return; // wait until results container is mounted

        resultsScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });

        // Remove the marker param so normal in-page searching doesn't keep re-triggering this behavior.
        const next = new URLSearchParams(searchParams.toString());
        next.delete("from");
        router.replace(`?${next.toString()}`);
    }, [fromSuggestions, debouncedQuery, router, searchParams]);

    // no localStorage or UI config — HOME_INITIAL_SONG_COUNT controls behavior

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalQuery(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (!val) {
            setDebouncedQuery("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("restore");
            params.delete("q");
            const next = params.toString();
            try {
                sessionStorage.removeItem("lastSearchQuery");
            } catch {
                // ignore
            }
            router.replace(next ? `?${next}` : "/home");
            return;
        }

        timeoutRef.current = setTimeout(() => {
            setDebouncedQuery(val);
            const params = new URLSearchParams(searchParams.toString());
            params.delete("restore");
            params.set("q", val);
            router.replace(`?${params.toString()}`);
        }, 500);
    };

    const handleChipClick = (cat: string) => {
        const newQuery = `${cat}`;
        setLocalQuery(newQuery);
        setDebouncedQuery(newQuery);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("restore");
        params.set("q", newQuery);
        router.replace(`?${params.toString()}`);
    };

    const handleItemClick = (data: [], item: any, index: number) => {
        if (item?.type === "song") {
            // Queue the entire list
            playList(data, index);
        } else {
            router.push(
                `/home/${item.type}/${item.id}?item=${encodeURIComponent(
                    JSON.stringify(item)
                )}`
            );
        }
    };

    return (
        <div className="text-white h-full min-h-0 flex flex-col overflow-hidden space-y-4">

            {/* Search Bar */}
            <Input
                prefix={<MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mr-2 sm:mr-3" />}
                placeholder={debouncedQuery ? "Searching..." : "Search for songs, artists, playlists..."}
                className="bg-[#1A203A] p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl text-xs sm:text-base text-white border-none placeholder-gray-500 shadow-lg border"
                value={localQuery}
                onChange={handleSearch}
                variant="borderless"
                allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-4 text-gray-400" /> }}
            />

            {/* Category Chips - Responsive Grid */}
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-start sm:justify-evenly overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        onClick={() => handleChipClick(cat)}
                        className={`
                            px-2 sm:px-3 md:px-4 py-1 rounded-md text-xs sm:text-sm cursor-pointer transition-all border whitespace-nowrap
                            bg-[#1A203A] border-transparent text-gray-300 hover:bg-[#232F4D] hover:border-gray-600
                        `}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            {/* Home initial songs configured in code via `HOME_INITIAL_SONG_COUNT` above. */}

            {/* Logic: If No Query -> Show Nothing (or placeholder). If Query -> Show Results. */}

            {debouncedQuery ? (
                <div className="bg-[#0e1730] rounded-xl p-3 flex flex-col flex-1 min-h-0">
                    <div
                        ref={resultsScrollRef}
                        className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#343F63] scrollbar-track-transparent animate-fadeIn"
                    >
                        <div className="space-y-6">
                            <div className="text-gray-400 text-sm mb-2">Results for "{debouncedQuery}"</div>

                            <ResuableSearchSection
                                title="Songs"
                                type="song"
                                query={debouncedQuery}
                                showPagination={false}
                                limit={HOME_INITIAL_SONG_COUNT ?? 24}
                                infinite={HOME_INITIAL_SONG_COUNT === null}
                                maxItems={HOME_INITIAL_SONG_COUNT}
                                handleItemClick={handleItemClick}
                                onShowMore={() => router.push(`/search/songs?q=${debouncedQuery}`)}
                            />
                            <ResuableSearchSection
                                title="Playlists"
                                type="playlist"
                                query={debouncedQuery}
                                showPagination={false}
                                limit={HOME_INITIAL_SONG_COUNT ?? 24}
                                infinite={HOME_INITIAL_SONG_COUNT === null}
                                maxItems={HOME_INITIAL_SONG_COUNT}
                                handleItemClick={handleItemClick}
                                onShowMore={() => router.push(`/search/playlists?q=${debouncedQuery}`)}
                            />
                            <ResuableSearchSection
                                title="Albums"
                                type="album"
                                query={debouncedQuery}
                                showPagination={false}
                                limit={HOME_INITIAL_SONG_COUNT ?? 24}
                                infinite={HOME_INITIAL_SONG_COUNT === null}
                                maxItems={HOME_INITIAL_SONG_COUNT}
                                handleItemClick={handleItemClick}
                                onShowMore={() => router.push(`/search/albums?q=${debouncedQuery}`)}
                            />
                            <ResuableSearchSection
                                title="Artists"
                                type="artist"
                                query={debouncedQuery}
                                showPagination={false}
                                limit={HOME_INITIAL_SONG_COUNT ?? 24}
                                infinite={HOME_INITIAL_SONG_COUNT === null}
                                maxItems={HOME_INITIAL_SONG_COUNT}
                                handleItemClick={handleItemClick}
                                onShowMore={() => router.push(`/search/artists?q=${debouncedQuery}`)}
                            />

                        </div>
                    </div>
                </div>
            ) : (
                /* Clean UI when no search */
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
                    <MagnifyingGlassIcon className="w-16 h-16 mb-4" />
                    <p className="text-center text-xs lg:text-xl font-bold italic">
                        Your music starts here
                    </p>
                    <p className="text-center text-ls text-gray-500">
                        Select a tag or search for something you love
                    </p>

                </div>
            )}
        </div>
    );
}
