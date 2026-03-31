'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import themeConfig from '../theme/themeConfig';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    currentTheme: ThemeType;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // ✅ Always start with LIGHT
    const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');

    useEffect(() => {
        // ✅ Only respect user choice from localStorage
        const savedTheme = localStorage.getItem('theme') as ThemeType | null;

        if (savedTheme === 'light' || savedTheme === 'dark') {
            setCurrentTheme(savedTheme);
        }
        // ❌ No system dark-mode detection
    }, []);

    const toggleTheme = () => {
        const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // ✅ Light by default, dark only if user toggles
    const algorithm =
        currentTheme === 'dark'
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm;

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            <ConfigProvider
                theme={{
                    ...themeConfig,
                    algorithm,
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
