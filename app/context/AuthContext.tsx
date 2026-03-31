'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/lib/definitions';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { message } = App.useApp();
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const isLoading = status === 'loading';
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name || '',
                email: session.user.email || '',
                role: session.user.role || 'user',
            } as User);
        } else {
            setUser(null);
        }
    }, [session]);

    const login = async (email: string, password: string) => {
        // This is now handled by the LoginForm calling the authenticate action
        // But we can keep it for compatibility if something else uses it
        // Note: next-auth/react signIn is usually used in client components
        // But LoginForm uses the server action. 
        // If we want to support this manual login call, we can call authenticate or signIn('credentials', ...)
        console.warn('AuthContext.login called, but login should be handled via the LoginForm server action.');
    };

    const register = async (name: string, email: string, password: string) => {
        // Implementation for register...
    };

    const logout = async () => {
        await signOut({ redirect: false });
        setUser(null);
        message.info('Logged out');
        router.push('/login');
    };

    console.log('User in AuthContext:', user);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
