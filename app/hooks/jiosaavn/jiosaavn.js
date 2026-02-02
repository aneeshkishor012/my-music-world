import { useState, useEffect } from "react";

/* ============================================================
    BASE URL
============================================================ */
// const staticUrl = "https://saavn.sumit.co";
const staticUrl = "https://jiosaavn-api-by-aneesh.vercel.app";

/* ============================================================
    SAFE FETCH HANDLER
============================================================ */
async function safeFetch(url, params = {}, retries = 3, delay = 1000) {
    const queryString = new URLSearchParams(params).toString();
    const finalUrl = `${staticUrl}${url}?${queryString}`;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(finalUrl, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            // Handle Rate Limiting (429)
            if (response.status === 429) {
                if (i < retries - 1) {
                    const waitTime = delay * Math.pow(2, i);
                    console.warn(`⚠️ 429 Too Many Requests. Retrying in ${waitTime}ms... (Attempt ${i + 1}/${retries})`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                throw new Error("API rate limit exceeded. Please try again later.");
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            if (i === retries - 1) {
                console.error("❌ Fetch Error:", err.message || err);
                throw err;
            }
            const waitTime = delay * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}

/* ============================================================
    UTILITY — MAP SONG ITEM
============================================================ */
const mapSong = (song) => ({
    ...song,
    title: song?.name || song?.title,
    description: song?.artists?.primary?.[0]?.name || song?.label || "",
    imageUri: song?.image?.[2]?.url || song?.image?.[1]?.url,
    url: song?.downloadUrl?.[4]?.url || song?.downloadUrl?.[3]?.url || song?.downloadUrl?.[0]?.url,
    duration: song?.duration ? (song.duration / 60).toFixed(2) : "0:00",
});

/* ============================================================
    GLOBAL SEARCH (Songs, Albums, Artists, Playlists)
============================================================ */
export async function jioSaavnGblSearch(query, page = 1, limit = 10) {
    return safeFetch("/api/search", { query, page, limit });
}

export function useJioSaavnSearch(query) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await jioSaavnGblSearch(query);
                setResults(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [query]);

    return { results, loading, error };
}

/* ============================================================
    SONG BY ID
============================================================ */
export async function getSongWithId(id) {
    return safeFetch(`/api/songs/${id}`);
}

export function useGetSongWithId(id) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);
            try {
                const data = await getSongWithId(id);
                setResults(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    return { results, loading, error };
}

/* ============================================================
    PLAYLIST BY ID (Multi Page)
============================================================ */
export async function getPlayListWithId(id, page, limit) {
    return safeFetch("/api/playlists", { id, page, limit });
}

export function useGetPlayListWithId(id) {
    const [playlistData, setPlaylistData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getPlayListWithId(id, 1, 50); // Fetch first 50 songs
                if (data.data) {
                    const mappedSongs = (data.data.songs ?? []).map(mapSong);
                    setPlaylistData({ ...data.data, songs: mappedSongs });
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    return { playlistData, loading, error };
}

/* ============================================================
    ARTIST BY ID
============================================================ */
export async function getArtistListWithId(id) {
    return safeFetch("/api/artists", { id, page: 1, songCount: 100 });
}

export function useGetArtistListWithId(id) {
    const [artistData, setArtistData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);
            try {
                const data = await getArtistListWithId(id);
                if (data.data) {
                    const mappedSongs = (data.data.topSongs ?? []).map(mapSong);
                    const mappedAlbums = (data.data.topAlbums ?? []).map(album => ({
                        ...album,
                        imageUri: album?.image?.[2]?.url,
                    }));
                    setArtistData({ ...data.data, songs: mappedSongs, albums: mappedAlbums });
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    return { artistData, loading, error };
}

/* ============================================================
    ALBUM BY ID
============================================================ */
export async function getAlbumListWithId(id) {
    return safeFetch("/api/albums", { id, page: 1, songCount: 100 });
}

export function useGetAlbumListWithId(id) {
    const [albumData, setAlbumData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);

            try {
                const data = await getAlbumListWithId(id);
                if (data.data) {
                    const mappedSongs = (data.data.songs ?? []).map(mapSong);
                    setAlbumData({ ...data.data, songs: mappedSongs });
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    return { albumData, loading, error };
}

/* ============================================================
    SEARCH — SONGS
============================================================ */
export async function getSongListOnSearch(query, page, limit) {
    return safeFetch("/api/search/songs", { query, page, limit });
}

export function useGetSongListOnSearch(query) {
    const limit = 10;

    const [searchSongList, setSearchSongList] = useState([]);
    const [searchSongListLoading, setSearchSongListLoading] = useState(false);
    const [searchSongListError, setSearchSongListError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const load = async () => {
            setSearchSongListLoading(true);
            setSearchSongListError(null);

            try {
                let page = 1;
                let all = [];

                const initial = await getSongListOnSearch(query, page, limit);
                const total = initial.data.total;
                const maxPages = Math.min(10, Math.ceil(total / limit));

                while (page <= maxPages) {
                    const data =
                        page === 1 ? initial : await getSongListOnSearch(query, page, limit);

                    const mapped = (data.data.results ?? []).map((song) => ({
                        ...song,
                        description: song?.artists?.primary?.[0]?.name,
                        imageUri: song?.image?.[2]?.url,
                        url: song?.downloadUrl?.[4]?.url,
                        duration: (song?.duration / 60).toFixed(2),
                    }));

                    all = [...all, ...mapped];
                    page++;
                }

                setSearchSongList(all);
            } catch (err) {
                setSearchSongListError(err);
            } finally {
                setSearchSongListLoading(false);
            }
        };

        load();
    }, [query]);

    return { searchSongList, searchSongListLoading, searchSongListError };
}

/* ============================================================
    SEARCH — ARTISTS
============================================================ */
export async function getArtistListOnSearch(query, page, limit) {
    return safeFetch("/api/search/artists", { query, page, limit });
}

export function useGetArtistListOnSearch(query) {
    const limit = 10;

    const [searchArtistList, setSearchArtistList] = useState([]);
    const [searchArtistListLoading, setSearchArtistListLoading] = useState(false);
    const [searchArtistListError, setSearchArtistListError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const load = async () => {
            setSearchArtistListLoading(true);
            setSearchArtistListError(null);

            try {
                let page = 1;
                let all = [];

                const initial = await getArtistListOnSearch(query, page, limit);
                const total = initial.data.total;
                const maxPages = Math.min(5, Math.ceil(total / limit));

                while (page <= maxPages) {
                    const data =
                        page === 1 ? initial : await getArtistListOnSearch(query, page, limit);

                    const mapped = (data.data.results ?? []).map((artist) => ({
                        ...artist,
                        imageUri: artist?.image?.[2]?.url,
                        description: artist?.role,
                    }));

                    all = [...all, ...mapped];
                    page++;
                }

                setSearchArtistList(all);
            } catch (err) {
                setSearchArtistListError(err);
            } finally {
                setSearchArtistListLoading(false);
            }
        };

        load();
    }, [query]);

    return { searchArtistList, searchArtistListLoading, searchArtistListError };
}

/* ============================================================
    SEARCH — ALBUMS
============================================================ */
export async function getAlbumListOnSearch(query, page, limit) {
    return safeFetch("/api/search/albums", { query, page, limit });
}

export function useGetAlbumListOnSearch(query) {
    const limit = 10;

    const [searchAlbumList, setSearchAlbumList] = useState([]);
    const [searchAlbumListLoading, setSearchAlbumListLoading] = useState(false);
    const [searchAlbumListError, setSearchAlbumListError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const load = async () => {
            setSearchAlbumListLoading(true);
            setSearchAlbumListError(null);

            try {
                let page = 1;
                let all = [];

                const initial = await getAlbumListOnSearch(query, page, limit);
                const total = initial.data.total;
                const maxPages = Math.min(5, Math.ceil(total / limit));

                while (page <= maxPages) {
                    const data =
                        page === 1 ? initial : await getAlbumListOnSearch(query, page, limit);

                    const mapped = (data.data.results ?? []).map((album) => ({
                        ...album,
                        description: album?.artists?.primary?.[0]?.name,
                        imageUri: album?.image?.[2]?.url,
                    }));

                    all = [...all, ...mapped];
                    page++;
                }

                setSearchAlbumList(all);
            } catch (err) {
                setSearchAlbumListError(err);
            } finally {
                setSearchAlbumListLoading(false);
            }
        };

        load();
    }, [query]);

    return { searchAlbumList, searchAlbumListLoading, searchAlbumListError };
}

/* ============================================================
    SEARCH — PLAYLISTS
============================================================ */
export async function getPlayListOnSearch(query, page, limit) {
    return safeFetch("/api/search/playlists", { query, page, limit });
}

export function useGetPlayListOnSearch(query) {
    const limit = 10;

    const [searchPlayList, setSearchPlayList] = useState([]);
    const [searchPlayListLoading, setSearchPlayListLoading] = useState(false);
    const [searchPlayListError, setSearchPlayListError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const load = async () => {
            setSearchPlayListLoading(true);
            setSearchPlayListError(null);

            try {
                let page = 1;
                let all = [];

                const initial = await getPlayListOnSearch(query, page, limit);
                const total = initial.data.total;
                const maxPages = Math.min(5, Math.ceil(total / limit));

                while (page <= maxPages) {
                    const data =
                        page === 1 ? initial : await getPlayListOnSearch(query, page, limit);

                    const mapped = (data.data.results ?? []).map((pl) => ({
                        ...pl,
                        imageUri: pl?.image?.[2]?.url,
                        description: pl?.songCount,
                    }));

                    all = [...all, ...mapped];
                    page++;
                }

                setSearchPlayList(all);
            } catch (err) {
                setSearchPlayListError(err);
            } finally {
                setSearchPlayListLoading(false);
            }
        };

        load();
    }, [query]);

    return { searchPlayList, searchPlayListLoading, searchPlayListError };
}
