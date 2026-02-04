"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "antd";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useInfiniteMusic } from "../../hooks/useMusicData";
import { usePlayer } from "../../context/PlayerContext";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useFavorites } from "../../context/FavoritesContext";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

// Import the Search Section Component
import { ResuableSearchSection } from "../../ui/components/SearchSection";
import { useRouter, useSearchParams } from "next/navigation";

export default function SongCategoryScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
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

    const clearSearch = () => {
        setLocalQuery("");
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

    // Data Hooks
    // Only fetch category songs if we are NOT searching (debouncedQuery is empty)
    // If searching, we show the search results instead
    const categoryQuery = debouncedQuery ? "" : initialQuery || "Trending"; // Fallback to Trending if just browsing chips
    // Actually, if query is empty, we show chips. If query is set (even via chip click), we show SEARCH results? 
    // The user said: "without search what ever i am showin in the rightside layout can you remove and keep the Song suggection chips."
    // BUT "The last Search Results should be Stay...".
    // AND "Clicking a chip will trigger a search and show results."
    // So if I click "Romance", it searches "Romance". Query becomes "Romance".
    // So actually:
    // 1. Query Empty? Show Chips.
    // 2. Query Set? Show Search Results.
    // BUT what about the "Category Songs" list? The user said "remove [it]". 
    // So we don't need `useInfiniteMusic` for the category list anymore?
    // "remove and keep the Song suggection chips. rest of the search functionality will be same".
    // Wait, if I remove the song list, then clicking a chip MUST search.
    // So I don't need `useInfiniteMusic` here at all anymore? Because searching uses `ReusableSearchSection` which uses `useGenericData`.
    // Let's assume yes.

    const { play, currentSong, isPlaying } = usePlayer();
    const { isFavorite, toggleFavorite } = useFavorites();

    return (
        <div className="text-white h-full min-h-0 flex flex-col overflow-hidden space-y-4">

            {/* Search Bar */}
            <Input
                prefix={<MagnifyingGlassIcon className="w-6 h-6 text-gray-400 mr-3" />}
                placeholder={debouncedQuery ? "Searching..." : "Search for songs, artists, playlists..."}
                className="bg-[#1A203A] p-4 rounded-xl text-white border-none  placeholder-gray-500  shadow-lg border"
                value={localQuery}
                onChange={handleSearch}
                variant="borderless"
                allowClear={{ clearIcon: <XMarkIcon className="w-6 h-4 text-gray-400" /> }}
            />

            {/* Category Chips - Always visible? Or only when no search? User said "keep the Song suggection chips". */}
            {/* If I keep them always visible, it's easy to switch context. */}
            <div className="flex flex-wrap gap-2 justify-evenly">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        onClick={() => handleChipClick(cat)}
                        className={`
                            px-4 py-1 rounded-md text-sm cursor-pointer transition-all border
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
                                onShowMore={() => router.push(`/search/artists?q=${debouncedQuery}`)}
                            />

                        </div>
                    </div>
                </div>
            ) : (
                /* Clean UI when no search */
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
                    <MagnifyingGlassIcon className="w-16 h-16 mb-4" />
                    <p>Select a tag or search to start listening</p>
                </div>
            )}
        </div>
    );
}
