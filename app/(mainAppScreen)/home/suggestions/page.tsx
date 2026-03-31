"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarPlayer from "@/app/ui/components/SidebarPlayer";
import Breadcrumbs from "@/app/ui/components/Breadcrumbs";
import { ResuableSearchSection } from "@/app/ui/components/SearchSection";
import { useGenericData } from "@/app/hooks/useGenericData";
import { usePlayer } from "@/app/context/PlayerContext";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/solid";

type Preferences = {
  languages?: string[];
  moods?: string[];
  actors?: Array<{ id: string; name: string }>;
};

type SuggestionType = "song" | "artist" | "album" | "playlist";

const MOOD_KEYWORDS: Record<string, string[]> = {
  Rock: ["rock", "guitar", "band", "electric"],
  "Hip-Hop": ["hip hop", "rap", "trap", "beats"],
  Party: ["party", "dance", "celebration", "club"],
  Romance: ["romantic", "love", "melody", "heart"],
  Pop: ["pop", "trending", "chartbuster", "hit"]
};

function buildSuggestionQuery({
  type,
  language,
  mood,
  artistName,
}: {
  type: SuggestionType;
  language: string;
  mood: string;
  artistName: string;
}) {

  const moodExpanded = mood
    ? (MOOD_KEYWORDS[mood] || [mood]).join(" ")
    : "";

  // 🎯 Strong Artist Priority
  if (artistName) {
    if (language && moodExpanded)
      return `${artistName} ${language} ${moodExpanded}`;

    if (language)
      return `${artistName} ${language} songs`;

    if (moodExpanded)
      return `${artistName} ${moodExpanded}`;

    return `${artistName} hits`;
  }

  // 🎯 Language + Mood
  if (language && moodExpanded) {
    return `${language} ${moodExpanded} ${type === "song"
        ? "songs"
        : type === "album"
          ? "albums"
          : "playlists"
      }`;
  }

  // 🎯 Language only
  if (language) {
    return `${language} ${type === "song"
        ? "songs"
        : type === "album"
          ? "albums"
          : "playlists"
      }`;
  }

  // 🎯 Mood only
  if (moodExpanded) {
    return `${moodExpanded} ${type === "song"
        ? "songs"
        : type === "album"
          ? "albums"
          : "playlists"
      }`;
  }

  // 🎯 Default fallback
  return type === "song"
    ? "trending songs"
    : type === "album"
      ? "trending albums"
      : "trending playlists";
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1 rounded-md text-sm border transition-all",
        active
          ? "bg-blue-600/30 border-blue-500/60 text-white"
          : "bg-[#1A203A] border-transparent text-gray-300 hover:bg-[#232F4D] hover:border-gray-600",
      ].join(" ")}
      aria-pressed={active}
      type="button"
    >
      {label}
    </button>
  );
}

function SuggestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { playList } = usePlayer();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userPreferences");
    if (!stored) {
      setPrefs(null);
      setPrefsLoaded(true);
      return;
    }

    try {
      setPrefs(JSON.parse(stored));
    } catch {
      setPrefs(null);
    } finally {
      setPrefsLoaded(true);
    }
  }, []);

  const availableLanguages = useMemo(() => prefs?.languages?.filter(Boolean) ?? [], [prefs]);
  const availableMoods = useMemo(() => prefs?.moods?.filter(Boolean) ?? [], [prefs]);
  const availableArtists = useMemo(() => prefs?.actors ?? [], [prefs]);

  const activeLanguageFromUrl = searchParams.get("lang") || "";
  const activeMoodFromUrl = searchParams.get("mood") || "";
  const activeArtistIdFromUrl = searchParams.get("artistId") || "";

  const activeLanguage = useMemo(() => {
    if (availableLanguages.length === 0) return "";
    if (availableLanguages.includes(activeLanguageFromUrl)) return activeLanguageFromUrl;
    return availableLanguages[0] || "";
  }, [availableLanguages, activeLanguageFromUrl]);

  const activeMood = useMemo(() => {
    if (availableMoods.length === 0) return "";
    if (availableMoods.includes(activeMoodFromUrl)) return activeMoodFromUrl;
    return availableMoods[0] || "";
  }, [availableMoods, activeMoodFromUrl]);

  const activeArtist = useMemo(() => {
    if (availableArtists.length === 0) return null;
    const found = availableArtists.find((a) => a.id === activeArtistIdFromUrl);
    return found ?? availableArtists[0] ?? null;
  }, [availableArtists, activeArtistIdFromUrl]);

  const activeArtistName = activeArtist?.name || "";

  useEffect(() => {
    if (!prefsLoaded) return;
    if (availableLanguages.length === 0 && availableMoods.length === 0 && availableArtists.length === 0) return;

    const next = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (availableLanguages.length > 0) {
      const lang = next.get("lang") || "";
      if (!lang || !availableLanguages.includes(lang)) {
        next.set("lang", availableLanguages[0] || "");
        changed = true;
      }
    } else if (next.has("lang")) {
      next.delete("lang");
      changed = true;
    }

    if (availableMoods.length > 0) {
      const mood = next.get("mood") || "";
      if (!mood || !availableMoods.includes(mood)) {
        next.set("mood", availableMoods[0] || "");
        changed = true;
      }
    } else if (next.has("mood")) {
      next.delete("mood");
      changed = true;
    }

    if (availableArtists.length > 0) {
      const artistId = next.get("artistId") || "";
      if (!artistId || !availableArtists.some((a) => a.id === artistId)) {
        next.set("artistId", availableArtists[0]?.id || "");
        changed = true;
      }
    } else if (next.has("artistId")) {
      next.delete("artistId");
      changed = true;
    }

    if (!changed) return;
    router.replace(`/home/suggestions?${next.toString()}`, { scroll: false });
  }, [prefsLoaded, availableLanguages, availableMoods, availableArtists, router, searchParams]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/home/suggestions?${next.toString()}`, { scroll: false });
  };

  const canSuggest = prefsLoaded && (availableLanguages.length > 0 || availableMoods.length > 0 || availableArtists.length > 0);
  const returnUrl = useMemo(() => {
    const params = searchParams.toString();
    return params ? `/home/suggestions?${params}` : "/home/suggestions";
  }, [searchParams]);

  const songQuery = useMemo(
    () => buildSuggestionQuery({ type: "song", language: activeLanguage, mood: activeMood, artistName: activeArtistName }),
    [activeLanguage, activeMood, activeArtistName]
  );
  const artistQuery = useMemo(
    () => buildSuggestionQuery({ type: "artist", language: activeLanguage, mood: activeMood, artistName: activeArtistName }),
    [activeLanguage, activeMood, activeArtistName]
  );
  const albumQuery = useMemo(
    () => buildSuggestionQuery({ type: "album", language: activeLanguage, mood: activeMood, artistName: activeArtistName }),
    [activeLanguage, activeMood, activeArtistName]
  );
  const playlistQuery = useMemo(
    () => buildSuggestionQuery({ type: "playlist", language: activeLanguage, mood: activeMood, artistName: activeArtistName }),
    [activeLanguage, activeMood, activeArtistName]
  );

  const peekSongs = useGenericData(canSuggest ? songQuery : "", "song", 1);
  const peekArtists = useGenericData(canSuggest ? artistQuery : "", "artist", 1);
  const peekAlbums = useGenericData(canSuggest ? albumQuery : "", "album", 1);
  const peekPlaylists = useGenericData(canSuggest ? playlistQuery : "", "playlist", 1);

  const showEmptyState =
    canSuggest &&
    !peekSongs.loading &&
    !peekArtists.loading &&
    !peekAlbums.loading &&
    !peekPlaylists.loading &&
    peekSongs.data.length === 0 &&
    peekArtists.data.length === 0 &&
    peekAlbums.data.length === 0 &&
    peekPlaylists.data.length === 0;

  const handleItemClick = (data: [], item: any, index: number) => {
    if (item?.type === "song") {
      // Queue the entire list
      playList(data, index);
    } else {
      router.push(
        `/home/suggestions/${item.type}/${item.id}?item=${encodeURIComponent(
          JSON.stringify(item)
        )}`
      );
    }
  };

  return (
    <div className="flex flex-row gap-1 h-full w-full">
      {/* LEFT CONTENT */}
      <div className="flex-1 overflow-hidden p-1 min-w-0 rounded-xl h-full scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {/* <Breadcrumbs items={[{ label: "Home", href: "/home/suggestions" }, { label: "Suggestions" }]} /> */}

        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white">Home Suggestions</h2>
            {canSuggest && (
              <button
                onClick={() => setShowFilterModal(true)}
                className="p-2 text-gray-300 hover:text-white bg-[#1A203A] hover:bg-[#232F4D] rounded-lg transition"
                title="Filter Suggestions"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {!canSuggest && (
          <div className="flex flex-col items-center justify-center text-gray-500 opacity-80 py-16">
            <p className="text-center">No suggestions available yet. Set your preferences first.</p>
            <button
              onClick={() => router.push("/welcome", { scroll: true })}
              className="mt-4 px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Go to Preferences
            </button>
          </div>
        )}

        {canSuggest && (
          <div className="mt-6 overflow-y-auto h-[88%] pr-2 scrollbar-thin scrollbar-thumb-[#343F63] scrollbar-track-transparent animate-fadeIn">
            <ResuableSearchSection
              title="Songs"
              type="song"
              query={songQuery}
              limit={14}
              infinite={false}
              handleItemClick={handleItemClick}
              onShowMore={() =>
                router.push(
                  `/home/suggestions/songs?q=${encodeURIComponent(songQuery)}&return=${encodeURIComponent(returnUrl)}`,
                  { scroll: true }
                )
              }
            />
            <ResuableSearchSection
              title="Playlists"
              type="playlist"
              query={playlistQuery}
              limit={14}
              infinite={false}
              handleItemClick={handleItemClick}
              onShowMore={() =>
                router.push(
                  `/home/suggestions/playlists?q=${encodeURIComponent(playlistQuery)}&return=${encodeURIComponent(returnUrl)}`,
                  { scroll: true }
                )
              }
            />
            <ResuableSearchSection
              title="Albums"
              type="album"
              query={albumQuery}
              limit={14}
              infinite={false}
              handleItemClick={handleItemClick}
              onShowMore={() =>
                router.push(
                  `/home/suggestions/albums?q=${encodeURIComponent(albumQuery)}&return=${encodeURIComponent(returnUrl)}`,
                  { scroll: true }
                )
              }
            />
            <ResuableSearchSection
              title="Artists"
              type="artist"
              query={artistQuery}
              limit={14}
              infinite={false}
              handleItemClick={handleItemClick}
              onShowMore={() =>
                router.push(
                  `/home/suggestions/artists?q=${encodeURIComponent(artistQuery)}&return=${encodeURIComponent(returnUrl)}`,
                  { scroll: true }
                )
              }
            />



            {showEmptyState && (
              <div className="flex flex-col items-center justify-center text-gray-500 opacity-80 py-16">
                <p className="text-center">No suggestions available for your selected filters.</p>
                <p className="text-center text-sm mt-1">Try changing filters.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden lg:block lg:w-[350px] xl:w-[400px] 2xl:w-[450px] shrink-0 h-full">
        <SidebarPlayer />
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden backdrop-blur-2xl bg-[#0b1120]/85 border border-white/10 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-bold text-white">Filter Suggestions</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-400 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              {availableLanguages.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Language</div>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((lang) => (
                      <div key={lang} className="contents">
                        <Chip label={lang} active={lang === activeLanguage} onClick={() => setParam("lang", lang)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableArtists.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Artist</div>
                  <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {availableArtists.map((a) => (
                      <div key={a.id} className="contents">
                        <Chip
                          label={a.name}
                          active={a.id === (activeArtist?.id || "")}
                          onClick={() => setParam("artistId", a.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableMoods.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Music Type</div>
                  <div className="flex flex-wrap gap-2">
                    {availableMoods.map((m) => (
                      <div key={m} className="contents">
                        <Chip label={m} active={m === activeMood} onClick={() => setParam("mood", m)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 flex justify-end">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeSuggestionsPage() {
  return (
    <div className="h-full text-white p-2">
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading suggestions...</div>}>
        <SuggestionsContent />
      </Suspense>
    </div>
  );
}
