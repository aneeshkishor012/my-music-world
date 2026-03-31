import '@/app/ui/global.css';
import { inter, lusitana } from '@/app/ui/fonts';
import ThemeProvider from "./providers/ThemeProvider";
import { PlayerProvider } from "./context/PlayerContext";

export const metadata = {
  title: "My Music App",
  description: "Music App Theme Setup",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import BottomPlayer from "./ui/BottomPlayer";
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <PlayerProvider>
            <FavoritesProvider>
              <SearchProvider>
                <Providers children={children} />
                <BottomPlayer />
              </SearchProvider>
            </FavoritesProvider>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
