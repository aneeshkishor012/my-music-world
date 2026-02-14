"use client";

import { MusicalNoteIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button } from "antd";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center text-white px-4 overflow-hidden">

      {/* Background Image */}
      <Image
        src="/images/Boombox-pana.png"
        alt="Background"
        fill
        priority
        unoptimized
        className="object-cover scale-105"
      />

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b]/70 via-[#050b24]/75 to-black"></div>
      

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">

        {/* Glass Container */}
        <div
          className="
                bg-transparent
                backdrop-blur-xl
                border border-white/10
                rounded-2xl
                p-8
                // shadow-[0_20px_60px_-15px_rgba(139,92,246,0.25)]
                text-center
                transition-all duration-500
              "
        >


          {/* Icon */}
          <div className="flex justify-center mb-6">
            <MusicalNoteIcon className="w-14 h-14 text-purple-400 drop-shadow-lg" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-wide">
            Welcome to My Music World
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-300 mb-10 leading-relaxed">
            Dive into a world of melodies, playlists, and your favorite artists.
            Your musical journey begins here.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Login Button – Primary Gradient */}
            <Link href="/login" className="w-full">
              <Button
                className="
                  w-full py-3
                  bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
                  hover:opacity-90
                  text-white
                  rounded-xl
                  font-semibold
                  border-none
                  shadow-lg shadow-purple-500/20
                  transition-all duration-300
                "
              >
                Login
              </Button>
            </Link>

            {/* Signup Button – Glass Style */}
            <Link href="/signup" className="w-full">
              <Button
                className="
                  w-full py-3
                  bg-white/5
                  hover:bg-white/10
                  text-white
                  rounded-xl
                  font-semibold
                  border border-white/10
                  flex items-center justify-center gap-2
                  transition-all duration-300
                "
              >
                Signup
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>

          </div>

          {/* Footer */}
          <p className="mt-10 text-xs text-gray-400">
            © {new Date().getFullYear()} My Music App. All Rights Reserved.
          </p>

        </div>
      </div>
    </div>
  );
}
