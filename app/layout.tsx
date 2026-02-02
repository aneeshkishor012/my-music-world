import '@/app/ui/global.css';
import { inter, lusitana } from '@/app/ui/fonts';
import ThemeProvider from "./providers/ThemeProvider";
import { PlayerProvider } from "./context/PlayerContext";

export const metadata = {
  title: "My Music App",
  description: "Music App Theme Setup",
};

import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import BottomPlayer from "./ui/BottomPlayer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <PlayerProvider>
            <FavoritesProvider>
              <SearchProvider>
                {children}
                <BottomPlayer />
              </SearchProvider>
            </FavoritesProvider>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
