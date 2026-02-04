"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const FAVORITES_STORAGE_KEY = "userFavorites:v1";

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

function normalizeFavoriteItem(item: Partial<FavoriteItem> & Record<string, any>): FavoriteItem | null {
    const id = String(item?.id || "").trim();
    if (!id) return null;

    const type: FavoriteItem["type"] | undefined =
        item.type ||
        (item.url ? "song" : undefined);

    if (!type) return null;

    const title = String(item.title || item.name || "").trim();
    if (!title) return null;

    return {
        id,
        type,
        title,
        description: item.description,
        imageUri: item.imageUri,
        url: item.url,
    };
}

export function FavoritesProvider({ children }: { children?: ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    const normalized = parsed
                        .map((x) => normalizeFavoriteItem(x))
                        .filter(Boolean) as FavoriteItem[];
                    setFavorites(normalized);
                }
            }
        } catch (e) {
            console.error("Failed to load favorites", e);
        } finally {
            setHydrated(true);
        }
    }, []);

    // Persist to LocalStorage whenever favorites change (after hydration)
    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.error("Failed to store favorites", e);
        }
    }, [favorites, hydrated]);

    const toggleFavorite = (item: FavoriteItem) => {
        setFavorites(prev => {
            const normalized = normalizeFavoriteItem(item);
            if (!normalized) return prev;

            const exists = prev.find(f => f.id === normalized.id);
            let updated;
            if (exists) {
                updated = prev.filter(f => f.id !== normalized.id); // Remove
            } else {
                updated = [...prev, normalized]; // Add
            }
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
