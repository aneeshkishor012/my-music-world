import { useState, useEffect, useCallback } from "react";
import { getAlbumListWithId, getArtistListWithId, getPlayListWithId, getSongListOnSearch } from "./jiosaavn/jiosaavn";
import { title } from "process";

export function useInfiniteMusic(query: string, type: string, id: string) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const LIMIT = 20;

    useEffect(() => {
        // Reset state when query changes
        setData([]);
        setPage(1);
        setHasMore(true);
        // Trigger initial load
        if (query) {
            loadMusic(1, query);
        }
    }, [query]);

    const loadMusic = async (pageNum: number, searchQuery: string) => {
        if (!searchQuery) return;

        setLoading(true);
        setError(null);

        try {
            let response = []
            if (type === "artist") {
                response = await getArtistListWithId(id);
                // response.data.topSongs
            } else if (type === "album") {
                response = await getAlbumListWithId(id);
            } else if (type === "playlist") {
                response = await getPlayListWithId(id, pageNum, LIMIT);
            } else {
                response = await getSongListOnSearch(searchQuery, pageNum, LIMIT);
            }



            if (type === "artist") {
                const mappedResults = (response.data.topSongs ?? []).map((song: any) => ({
                    ...song,
                    description: song?.artists?.primary?.[0]?.name,
                    imageUri: song?.image?.[2]?.url,
                    url: song?.downloadUrl?.[4]?.url,
                    duration: (song?.duration / 60).toFixed(2),
                }));
                setData(mappedResults);
            } else if (type === "playlist" || type === "album") {
                const mappedResults = (response.data.songs ?? []).map((song: any) => ({
                    ...song,
                    title: song?.name,
                    imageUri: song?.image?.[2]?.url,
                    url: song?.downloadUrl?.[4]?.url,
                    duration: (song?.duration / 60).toFixed(2),
                }));
                if (mappedResults.length === 0 || mappedResults.length < LIMIT) {
                    setHasMore(false);
                }

                setData(prev => pageNum === 1 ? mappedResults : [...prev, ...mappedResults]);
            } else {
                const mappedResults = (response.data.results ?? []).map((song: any) => ({
                    ...song,
                    description: song?.artists?.primary?.[0]?.name,
                    imageUri: song?.image?.[2]?.url,
                    url: song?.downloadUrl?.[4]?.url,
                    duration: (song?.duration / 60).toFixed(2),
                }));
                if (mappedResults.length === 0 || mappedResults.length < LIMIT) {
                    setHasMore(false);
                }

                setData(prev => pageNum === 1 ? mappedResults : [...prev, ...mappedResults]);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadMusic(nextPage, query);
        }
    }, [loading, hasMore, page, query]);

    return { data, loading, error, hasMore, loadMore };
}
