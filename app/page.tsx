"use client";

import { MusicalNoteIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button } from "antd";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="App">
      <div className="min-h-screen relative flex items-center justify-center text-white px-4">
        {/* Background Image */}
        <Image
          src="https://r4.wallpaperflare.com/wallpaper/612/19/690/geometry-cyberspace-digital-art-lines-wallpaper-1970aeaa9c72e63a307f8535d917da7b.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">

          {/* Icon */}
          <MusicalNoteIcon className="w-16 h-16 text-purple-400 mb-6 animate-pulse" />

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Welcome to My Music World
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-300 max-w-md mb-10">
            Dive into a world of melodies, playlists, and your favorite artists.
            Your musical journey begins here.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-sm justify-center">

            {/* Login Button */}
            <Link href="/login" className="w-full">
              <Button
                type="primary"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold border-none"
              >
                Login
              </Button>
            </Link>

            {/* Signup Button */}
            <Link href="/signup" className="w-full">
              <Button
                className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold border-none flex items-center justify-center gap-2"
              >
                Signup
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-10 text-xs text-gray-300">
            © {new Date().getFullYear()} My Music App. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
