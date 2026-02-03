"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type FavoriteItem = {
    id: string;
    title: string;
    description?: string;
    imageUri?: string;
    type: "song" | "artist" | "album" | "playlist";
    url?: string; // For songs (to play)
};

type FavoritesContextType = {
    favorites: FavoriteItem[];
    toggleFavorite: (item: FavoriteItem) => void;
    isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children?: ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    // Load from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem("userFavorites");
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to load favorites", e);
            }
        }
    }, []);

    const toggleFavorite = (item: FavoriteItem) => {
        setFavorites(prev => {
            const exists = prev.find(f => f.id === item.id);
            let updated;
            if (exists) {
                updated = prev.filter(f => f.id !== item.id); // Remove
            } else {
                updated = [...prev, item]; // Add
            }
            localStorage.setItem("userFavorites", JSON.stringify(updated));
            return updated;
        });
    };

    const isFavorite = (id: string) => {
        return favorites.some(f => f.id === id);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}
