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
        <div className="space-y-6 animate-fadeIn">

            <h2 className="text-white text-xl sm:text-2xl font-bold text-center tracking-wide">
                Select Languages
            </h2>
            <div className="flex flex-wrap justify-center gap-3">

                {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);

                    return (
                        <button
                            key={lang}
                            onClick={() =>
                                toggleSelection(lang, selectedLanguages, setSelectedLanguages)
                            }
                            className={`
                            px-4 py-1.5 sm:px-6 sm:py-2
                            rounded-full
                            text-sm sm:text-base
                            font-medium
                            transition-all duration-300
                            border
                            
                            ${isSelected ? `
                                bg-gradient-to-r
                                from-purple-600
                                via-indigo-600
                                to-blue-600
                                border-transparent
                                text-white
                                shadow-[0_0_20px_rgba(139,92,246,0.5)]
                                scale-105
                                `
                                    : `
                                bg-white/5
                                border-white/10
                                text-gray-300
                                hover:bg-white/10
                                hover:border-purple-500/40
                                `}
                            `}
                        >
                            {lang}
                        </button>
                    );
                })}

            </div>
        </div>
    );


    const renderStep2_Actors = () => (
        <div className="space-y-1 animate-fadeIn">

            <h2 className="text-white text-xl sm:text-2xl font-bold text-center tracking-wide">
                Favorite Artists
            </h2>

            {/* Selected Artists Chips */}
            <div className="hidden md:flex flex-wrap gap-2 justify-center mb-3">
                {selectedActors.map((actor) => (
                    <div
                        key={actor.id}
                        className=" flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 border border-purple-500/40 text-purple-300   backdrop-blur-md " >
                        <span className="text-sm">{actor.name}</span>
                        <button
                            onClick={() => removeActor(actor.id)}
                            className="hover:text-white transition"
                            aria-label={`Remove ${actor.name}`}
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
                <div className=" flex items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md focus-within:border-purple-500/50 transition-all" >
                    <Input
                        prefix={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />}
                        placeholder="Search for artists (e.g. Arijit Singh)..."
                        variant="borderless"
                        className="px-4 py-3 text-white"
                        value={artistQuery}
                        allowClear={{
                            clearIcon: <XMarkIcon className="w-4 h-4 text-gray-400" />,
                        }}
                        onChange={(e) => setArtistQuery(e.target.value)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {artistQuery && (
                    <div className=" absolute z-30 w-full mt-2 rounded-xl bg-[#0b1120]/95  backdrop-blur-xl border border-white/10  shadow-2xl  max-h-60 overflow-y-auto  " >
                        {searchArtistListLoading && (
                            <div className="p-4 text-center text-gray-400">Loading...</div>
                        )}

                        {!searchArtistListLoading &&
                            searchArtistList.map((artist: any) => {
                                const isSelected = selectedActors.find(
                                    (a) => a.id === artist.id
                                );

                                return (
                                    <div
                                        key={artist.id}
                                        onClick={() => addActor(artist)}
                                        className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-all  border-b border-white/5 last:border-none  " >
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
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
                                                <div className="w-full h-full flex items-center justify-center text-xs">
                                                    ?
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-white text-sm">{artist.name}</h4>
                                            <p className="text-gray-500 text-xs capitalize">
                                                {artist.description || artist.role}
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <CheckCircleIcon className="w-5 h-5 text-purple-500" />
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>

            {/* Default Artists */}
            {!artistQuery && (
                <div className="space-y-4 pt-2">

                    <div className="  space-y-3  max-h-[38vh]  overflow-y-auto  pr-1 " >
                        {Object.entries(defaultArtistsByLanguage).map(
                            ([language, list]: any) => (
                                <div key={language} className="space-y-3">

                                    <h3 className="text-lg font-semibold text-white px-1">
                                        {language}
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {list.map((artist: any) => {
                                            const isSelected = selectedActors.find(
                                                (a) => a.id === artist.id
                                            );

                                            return (
                                                <button
                                                    key={artist.id}
                                                    onClick={() => addActor(artist)}
                                                    className={` group flex items-center gap-3 rounded-xl border px-3 py-2 transition-all text-left backdrop-blur-md

                                                    ${isSelected ? `  bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20  border-purple-500/40  ` : ` bg-white/5  border-white/10  hover:bg-white/10  `} `}
                                                >
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
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
                                                            <div className="w-full h-full flex items-center justify-center text-xs">
                                                                ?
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[11px] text-white truncate">
                                                            {artist.name}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 truncate capitalize block">
                                                            {artist.description || artist.role || "Artist"}
                                                        </span>
                                                    </div>


                                                    {isSelected && (
                                                        <CheckCircleIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );


    const renderStep3_Moods = () => (
        <div className="space-y-1 animate-fadeIn">

            <h2 className="text-white text-xl sm:text-2xl font-bold text-center tracking-wide">
                What's your Vibe?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">

                {MOODS.map((mood) => {
                    const isSelected = selectedMoods.includes(mood);

                    return (
                        <div
                            key={mood}
                            onClick={() =>
                                toggleSelection(mood, selectedMoods, setSelectedMoods)
                            }
                            className={` cursor-pointer rounded-xl  p-3 sm:p-4 text-center  font-medium transition-all duration-300 backdrop-blur-md border
                                        ${isSelected ? ` bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600  border-transparent text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] scale-105 ` : ` bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-purple-500/40 `} `}
                        >
                            {mood}
                        </div>
                    );
                })}

            </div>
        </div>
    );


    return (
        <div className="relative min-full flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
            {/* Navigation Buttons */}
            <div className="flex gap-3 pb-8 justify-center">

                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold transition-all"
                    >
                        Back
                    </button>
                )}

                {step < 3 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 font-bold hover:scale-105 hover:shadow-purple-500/40 transition-all">
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        className="text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl  bg-gradient-to-r  from-purple-600 via-indigo-600 to-blue-600 font-bold hover:scale-105 hover:shadow-purple-500/40 transition-all "
                    >
                        Start Listening
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-lg mx-auto bg-white/10 h-2 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            {/* Content Area */}
            <div className="w-full max-w-3xl mx-auto h-[60%]">
                {step === 1 && renderStep1_Languages()}
                {step === 2 && renderStep2_Actors()}
                {step === 3 && renderStep3_Moods()}
            </div>

        </div>
    );

}
