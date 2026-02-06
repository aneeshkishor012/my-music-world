import { useState, useCallback, useEffect } from "react";
// Import the raw fetch functions from the existing jiosaavn file
import {
    getSongListOnSearch,
    getArtistListOnSearch,
    getAlbumListOnSearch,
    getPlayListOnSearch
} from "./jiosaavn/jiosaavn"; // Adjust path

type SearchType = "song" | "artist" | "album" | "playlist";

export function useGenericData(query: string, type: SearchType, initialLimit = 20) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Reset when query or type changes
    useEffect(() => {
        setData([]);
        setPage(1);
        setHasMore(true);
        setTotal(0);

        if (query) {
            loadData(1, query);
        }
    }, [query, type]);

    const loadData = async (pageNum: number, searchQuery: string) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            // Map type to function
            switch (type) {
                case "artist": response = await getArtistListOnSearch(searchQuery, pageNum, initialLimit); break;
                case "album": response = await getAlbumListOnSearch(searchQuery, pageNum, initialLimit); break;
                case "playlist": response = await getPlayListOnSearch(searchQuery, pageNum, initialLimit); break;
                case "song":
                default:
                    response = await getSongListOnSearch(searchQuery, pageNum, initialLimit);
                    break;
            }

            const rawResults = response.data.results ?? [];
            setTotal(response.data.total);

            // Normalize Data
            const mapped = rawResults.map((item: any) => normalizeItem(item, type));

            if (mapped.length < initialLimit) setHasMore(false);

            setData(prev => pageNum === 1 ? mapped : [...prev, ...mapped]);

        } catch (err: any) {
            setError(err.message || "Failed to load results. Please try again.");
            console.error(`Error loading ${type}:`, err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadData(nextPage, query);
        }
    }, [loading, hasMore, page, query]);

    // Load a specific page (for pagination controls)
    const loadPage = useCallback((pageNum: number) => {
        if (pageNum < 1) return;
        setPage(pageNum);
        loadData(pageNum, query);
    }, [query]);

    return { data, loading, error, hasMore, loadMore, total, page, loadPage };
}

// Helper to standardise display fields
function normalizeItem(item: any, type: SearchType) {
    let title = item.title || item.name;
    let desc = "";
    let image = item.image?.[2]?.url || item.image?.[1]?.url || "";
    let id = item.id;
    let url = undefined;

    if (type === "song") {
        desc = item?.artists?.primary?.[0]?.name || item.label || "";
        title = item.title || item.name;
        image = item.image?.[2]?.url;
        // Map the highest quality download URL
        if (item.downloadUrl && item.downloadUrl.length > 0) {
            // Try 4 (320kbps) or fallback to last available
            const dlObj = item.downloadUrl[4] || item.downloadUrl[item.downloadUrl.length - 1];
            url = dlObj?.url || dlObj?.link;
        }
    } else if (type === "artist") {
        title = item.name;
        desc = item.role || "Artist";
        image = item.image?.[2]?.url;
    } else if (type === "album") {
        title = item.title || item.name;
        desc = item?.artists?.primary?.[0]?.name || item.year || "Album";
        image = item.image?.[2]?.url;
    } else if (type === "playlist") {
        title = item.title || item.name;
        desc = `${item.songCount || 0} Songs`;
        image = item.image?.[2]?.url;
    }

    // Fallback image
    if (!image) {
        // Could place a default image logic here
        // image = "/default-placeholder.png"; 
    }

    return {
        id,
        title,
        description: desc,
        imageUri: image,
        url,
        type,
        duration: (item.duration / 60).toFixed(2),
        raw: item,
    };
}
