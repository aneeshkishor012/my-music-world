"use client";

import { MusicalNoteIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button } from "antd";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 text-white">

      {/* Cinematic Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(30,27,75)] via-[rgb(5,11,36)] to-black" />

      {/* Blurred Background Illustration */}
      <Image
        src="/images/Boombox-pana.png"
        alt="Background"
        fill
        priority
        unoptimized
        className="object-contain scale-110 blur-2xl opacity-30"
      />

      {/* Main Glass Card Container */}
      <div className="relative z-20 w-full max-w-lg">

        <div
          className="
            backdrop-blur-2xl
            bg-[#0b1120]/85
            border border-white/10
            rounded-3xl
            shadow-[0_8px_40px_rgba(0,0,0,0.8)]
            p-10
            text-center
            transition-all duration-500
          "
        >

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <MusicalNoteIcon className="w-14 h-14 text-purple-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]" />
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

            {/* Primary CTA */}
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

            {/* Secondary Glass Button */}
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
    </main>
  );
}
