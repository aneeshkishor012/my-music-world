"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type React from 'react';
import { CheckCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useGetArtistListOnSearch } from "../../hooks/jiosaavn/jiosaavn"; // Adjust path if needed

// Predefined Options
const LANGUAGES = ["English", "Hindi", "Tamil", "Malayalam", "Kannada", "Telugu", "Punjabi", "Spanish"];
const MOODS = ["Pop", "Romance", "Party", "Sad", "Sleep", "Workout", "Lo-Fi", "Rock", "Hip-Hop", "Devotional"];

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
        router.push("/home");
    };

    // --- Render Steps ---

    const renderStep1_Languages = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center">Select Languages</h2>
            <p className="text-gray-400 text-center">What kind of music do you listen to?</p>

            <div className="flex flex-wrap justify-center gap-3">
                {LANGUAGES.map(lang => (
                    <button
                        key={lang}
                        onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                        className={`
                            px-6 py-2 rounded-full border border-gray-600 transition-all
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
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center">Favorite Artists</h2>
            <p className="text-gray-400 text-center">Search and add your favorite singers/actors.</p>

            {/* Selected Artists Chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                {selectedActors.map(actor => (
                    <div key={actor.id} className="flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-600/50">
                        <span className="text-sm">{actor.name}</span>
                        <button onClick={() => removeActor(actor.id)} className="hover:text-white">×</button>
                    </div>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
                <div className="flex items-center bg-[#1A2340] rounded-lg px-4 py-3 border border-gray-700 focus-within:border-blue-500 transition-colors">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search for artists (e.g. Arijit Singh)..."
                        className="bg-transparent border-none outline-none text-white w-full"
                        value={artistQuery}
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
                                        <Image src={artist.imageUri || artist.image} alt={artist.name} width={40} height={40} className="object-cover w-full h-full" />
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
        </div>
    );

    const renderStep3_Moods = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center">What's your Vibe?</h2>
            <p className="text-gray-400 text-center">Pick some moods to get you started.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {MOODS.map(mood => (
                    <div
                        key={mood}
                        onClick={() => toggleSelection(mood, selectedMoods, setSelectedMoods)}
                        className={`
                            cursor-pointer rounded-xl p-4 text-center border transition-all duration-200
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
        <div className="min-h-screen bg-[#0F0F1A] text-white flex flex-col items-center justify-center px-4 py-8">

            {/* Progress Bar */}
            <div className="w-full max-w-lg bg-gray-800 h-2 rounded-full mb-12 overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                ></div>
            </div>

            {/* Content Area */}
            <div className="w-full max-w-3xl mb-12 min-h-[400px]">
                {step === 1 && renderStep1_Languages()}
                {step === 2 && renderStep2_Actors()}
                {step === 3 && renderStep3_Moods()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="px-8 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold transition-colors"
                    >
                        Back
                    </button>
                )}

                {step < 3 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                    >
                        Start Listening
                    </button>
                )}
            </div>
        </div>
    );
}
