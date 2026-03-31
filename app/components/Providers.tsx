'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { App } from 'antd';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StyledComponentsRegistry>
            <SessionProvider>
                <ThemeProvider>
                    <App>
                        <AuthProvider>
                            <CartProvider>
                                {children}
                            </CartProvider>
                        </AuthProvider>
                    </App>
                </ThemeProvider>
            </SessionProvider>
        </StyledComponentsRegistry>
    );
}
