import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AntdRegistry from './lib/AntdRegistry';
import Providers from './providers';
import AppLayout from './components/common/AppLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Markkam | Shopping App',
  description: 'A modern e-commerce application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <AntdRegistry>
          <Providers>
            <AppLayout>
              {children}
            </AppLayout>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
