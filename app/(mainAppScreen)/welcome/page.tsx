"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type React from 'react';
import { CheckCircleIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getArtistListOnSearch, useGetArtistListOnSearch } from "../../hooks/jiosaavn/jiosaavn"; // Adjust path if needed
import Input from "antd/es/input/Input";

// Predefined Options
const LANGUAGES = ["English", "Hindi", "Tamil", "Malayalam", "Kannada", "Telugu", "Punjabi", "Spanish"];
const MOODS = ["Pop", "Romance", "Party", "Sad", "Sleep", "Workout", "Lo-Fi", "Rock", "Hip-Hop", "Devotional"];

const DEFAULT_ARTIST_LANGUAGES = ["Malayalam", "Kannada", "Tamil", "Hindi", "English"] as const;
type DefaultArtistLanguage = typeof DEFAULT_ARTIST_LANGUAGES[number];

const DEFAULT_ARTIST_QUERIES: Record<DefaultArtistLanguage, string> = {
    Malayalam: "Malayalam singer",
    Kannada: "Kannada singer",
    Tamil: "Tamil singer",
    Hindi: "Hindi singer",
    English: "English singer",
};

export default function PreferencesPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Preferences State
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedActors, setSelectedActors] = useState<any[]>([]); // Store full artist objects
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

    // Artist Search State
    const [artistQuery, setArtistQuery] = useState("");
    // Use the existing hook for artist search
    const { searchArtistList, searchArtistListLoading } = useGetArtistListOnSearch(artistQuery);

    // Default Artists (when user hasn't searched yet)
    const [defaultArtistsByLanguage, setDefaultArtistsByLanguage] = useState<Partial<Record<DefaultArtistLanguage, any[]>>>({});
    const [defaultArtistsLoading, setDefaultArtistsLoading] = useState(false);
    const [defaultArtistsError, setDefaultArtistsError] = useState<string | null>(null);

    useEffect(() => {
        if (step !== 2) return;
        if (Object.keys(defaultArtistsByLanguage).length > 0) return;

        let cancelled = false;

        const load = async () => {
            setDefaultArtistsLoading(true);
            setDefaultArtistsError(null);

            try {
                const limit = 24;
                const maxPages = 2;

                const results = await Promise.all(
                    DEFAULT_ARTIST_LANGUAGES.map(async (language) => {
                        const query = DEFAULT_ARTIST_QUERIES[language];
                        const seen = new Set<string>();
                        const all: any[] = [];

                        for (let page = 1; page <= maxPages; page++) {
                            const data = await getArtistListOnSearch(query, page, limit);
                            const mapped = (data?.data?.results ?? []).map((artist: any) => ({
                                ...artist,
                                imageUri: artist?.image?.[2]?.url,
                                description: artist?.role,
                            }));

                            for (const artist of mapped) {
                                if (!artist?.id) continue;
                                if (seen.has(artist.id)) continue;
                                seen.add(artist.id);
                                all.push(artist);
                            }
                        }

                        return [language, all] as const;
                    })
                );

                if (cancelled) return;
                setDefaultArtistsByLanguage(Object.fromEntries(results));
            } catch (err: any) {
                if (cancelled) return;
                setDefaultArtistsError(err?.message || "Failed to load default artists.");
            } finally {
                if (cancelled) return;
                setDefaultArtistsLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [step, defaultArtistsByLanguage]);

    // --- Handlers ---

    const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const addActor = (artist: any) => {
        if (!selectedActors.find(a => a.id === artist.id)) {
            setSelectedActors([...selectedActors, artist]);
        }
        setArtistQuery(""); // Clear search after adding
    };

    const removeActor = (artistId: string) => {
        setSelectedActors(selectedActors.filter(a => a.id !== artistId));
    };

    const handleSave = () => {
        // Save to LocalStorage
        const preferences = {
            languages: selectedLanguages,
            actors: selectedActors,
            moods: selectedMoods,
        };
        localStorage.setItem("userPreferences", JSON.stringify(preferences));

        // Redirect
        router.push("/home/suggestions");
    };

    // --- Render Steps ---

    const renderStep1_Languages = () => (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl sm:text-2xl font-bold text-center">Select Languages</h2>
            <p className="text-gray-400 text-center text-sm sm:text-base">What kind of music do you listen to?</p>

            <div className="flex flex-wrap justify-center gap-3">
                {LANGUAGES.map(lang => (
                    <button
                        key={lang}
                        onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                        className={`
                            px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-gray-600 transition-all
                            ${selectedLanguages.includes(lang)
                                ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                : "hover:bg-gray-800 text-gray-300"}
                        `}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2_Actors = () => (
        <div className="space-y-2 animate-fadeIn">
            <h2 className="text-xl sm:text-2xl font-bold text-center">Favorite Artists</h2>
            <p className="text-gray-400 text-center text-sm sm:text-base">Search and add your favorite singers/actors.</p>

            {/* Selected Artists Chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-3">
                {selectedActors.map(actor => (
                    <div key={actor.id} className="flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-600/50">
                        <span className="text-sm">{actor.name}</span>
                        <button onClick={() => removeActor(actor.id)} className="hover:text-white" aria-label={`Remove ${actor.name}`}>
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
                <div className="flex items-center border border-gray-700 focus-within:border-blue-500 rounded-lg">

                    <Input
                        prefix={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />}
                        type="text"
                        placeholder="Search for artists (e.g. Arijit Singh)..."
                        className="px-4 py-3 bg-[#1A2340] border-none outline-none text-white w-full"
                        variant="borderless"
                        value={artistQuery}
                        allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 text-white " /> }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtistQuery(e.target.value)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {artistQuery && (
                    <div className="absolute z-10 w-full bg-[#1A2340] mt-2 rounded-lg shadow-xl border border-gray-700 max-h-60 overflow-y-auto">
                        {searchArtistListLoading && <div className="p-4 text-center text-gray-400">Loading...</div>}
                        {!searchArtistListLoading && searchArtistList.map((artist: any) => (
                            <div
                                key={artist.id}
                                onClick={() => addActor(artist)}
                                className="flex items-center gap-3 p-3 hover:bg-[#232F4D] cursor-pointer transition-colors border-b border-gray-700 last:border-none"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-600">
                                    {/* Some API results might not have images, handling gracefully */}
                                    {(artist.imageUri || artist.image) ? (
                                        <Image
                                            src={artist.imageUri || artist.image}
                                            alt={artist.name}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                            unoptimized
                                        />
                                    ) : <div className="w-full h-full flex items-center justify-center text-xs">?</div>}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white text-sm">{artist.name}</h4>
                                    <p className="text-gray-500 text-xs capitalize">{artist.description || artist.role}</p>
                                </div>
                                {selectedActors.find(a => a.id === artist.id) && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Default Artists (shown when search box is empty) */}
            {!artistQuery && (
                <div className="space-y-4 pt-1">
                    <p className="text-center text-sm text-gray-400">Browse artists by language, or use search above.</p>

                    {defaultArtistsError && (
                        <div className="text-center text-sm text-red-400">
                            {defaultArtistsError} Try searching instead.
                        </div>
                    )}

                    <div className="space-y-2 max-h-[38vh] w-full overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                        {(() => {
                            const preferred = selectedLanguages.filter((l) =>
                                (DEFAULT_ARTIST_LANGUAGES as readonly string[]).includes(l)
                            ) as DefaultArtistLanguage[];
                            const languagesToShow = preferred.length ? preferred : [...DEFAULT_ARTIST_LANGUAGES];

                            return languagesToShow.map((language) => {
                                const list = defaultArtistsByLanguage[language] ?? [];

                                return (
                                    <div key={language} className="space-y-3">
                                        <h3 className="text-lg font-semibold text-white px-1">{language}</h3>

                                        {defaultArtistsLoading && list.length === 0 ? (
                                            <div className="text-sm text-gray-400 px-1">Loading {language} artists...</div>
                                        ) : list.length === 0 ? (
                                            <div className="text-sm text-gray-500 px-1">No artists found.</div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {list.map((artist: any) => (
                                                    <button
                                                        key={artist.id}
                                                        onClick={() => addActor(artist)}
                                                        className="group flex items-center gap-3 rounded-lg border border-gray-700 bg-[#1A2340] px-3 py-2 hover:bg-[#232F4D] transition-colors text-left"
                                                    >
                                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-600">
                                                            {(artist.imageUri || artist.image) ? (
                                                                <Image
                                                                    src={artist.imageUri || artist.image}
                                                                    alt={artist.name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="object-cover w-full h-full"
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs">?</div>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm text-white truncate">{artist.name}</span>
                                                                {selectedActors.find(a => a.id === artist.id) && (
                                                                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-500 truncate capitalize">
                                                                {artist.description || artist.role || "Artist"}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep3_Moods = () => (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl sm:text-2xl font-bold text-center">What's your Vibe?</h2>
            <p className="text-gray-400 text-center text-sm sm:text-base">Pick some moods to get you started.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
                {MOODS.map(mood => (
                    <div
                        key={mood}
                        onClick={() => toggleSelection(mood, selectedMoods, setSelectedMoods)}
                        className={`
                            cursor-pointer rounded-xl p-3 sm:p-4 text-center border transition-all duration-200
                            ${selectedMoods.includes(mood)
                                ? "bg-gradient-to-br from-purple-600 to-blue-600 border-transparent text-white scale-105"
                                : "bg-[#1A2340] border-gray-700 hover:border-gray-500 text-gray-300"}
                        `}
                    >
                        {mood}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F0F1A] text-white flex flex-col items-center px-4 py-5 lg:py-7">
            {/* Navigation Buttons */}
            <div className="flex gap-3 pb-10">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold transition-colors"
                    >
                        Back
                    </button>
                )}

                {step < 3 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                    >
                        Start Listening
                    </button>
                )}
            </div>
            {/* Progress Bar */}
            <div className="w-11/12 sm:w-4/5 max-w-lg bg-gray-800 h-2 rounded-full mb-6 lg:mb-10 overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                ></div>
            </div>

            {/* Content Area */}
            <div className="w-full sm:w-4/5 max-w-3xl mb-6 lg:mb-10 min-h-[320px] lg:min-h-[380px]">
                {step === 1 && renderStep1_Languages()}
                {step === 2 && renderStep2_Actors()}
                {step === 3 && renderStep3_Moods()}
            </div>
        </div>
    );
}
