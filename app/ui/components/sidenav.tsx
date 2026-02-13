"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "antd";

import {
  HomeIcon,
  MagnifyingGlassIcon,
  PowerIcon,
  HeartIcon
} from "@heroicons/react/24/solid";

export default function SideNav() {
  return (
    <div className="flex w-full flex-col h-full text-white p-3">
      {/* Top Navigation */}
      <div className="flex flex-col items-center gap-6 mt-4">
        {/* Home Suggestions (Discovery) */}
        <Link href="/home/suggestions">
          <HomeIcon className="w-8 h-8 text-gray-300 hover:text-white transition" />
        </Link>

        {/* Search (Explore) */}
        <Link href="/home?restore=1">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-300 hover:text-white transition" />
        </Link>

        {/* Favorites */}
        <Link href="/favorites">
          <HeartIcon className="w-8 h-8 text-gray-300 hover:text-white transition" />
        </Link>
      </div>

      {/* Spacer to push logout to bottom */}
      <div className="flex-grow"></div>
    </div>
  );
}
