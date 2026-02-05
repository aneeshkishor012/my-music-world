"use client";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
  return (
    <button
      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Logout
    </button>
  );
}