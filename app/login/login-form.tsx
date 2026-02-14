"use client";

import {
  LockClosedIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { authenticate } from "../lib/actions";
import styles from "./login-form.module.css";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/welcome";

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-white">
      {/* <div className="relative w-full p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-[#0b1120]/80 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.8)] overflow-hidden"> */}
      <div className="relative z-20 w-full max-w-[100%] sm:max-w-md md:max-w-lg">

        {/* Subtle Glow Effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-pink-500/20 blur-2xl opacity-40 -z-10" />

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold mb-2 tracking-wide">
          Sign In
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Welcome to My Music World 🎵
        </p>

        {/* FORM */}
        <form action={formAction} className={`${styles.loginForm} space-y-5`}>

          {/* Username */}
          <Input
            prefix={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            name="email"
            placeholder="Username or phone"
            variant="borderless"
            allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 text-gray-400" /> }}
            required
            className="!bg-white/5 hover:!bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 text-white border border-white/10 backdrop-blur-md"
          />

          {/* Password */}
          <Input.Password
            prefix={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            name="password"
            placeholder="Password"
            variant="borderless"
            allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 text-gray-400" /> }}
            required
            minLength={6}
            className="!bg-white/5 hover:!bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 text-white border border-white/10 backdrop-blur-md"
          />

          <input type="hidden" name="redirectTo" value={callbackUrl} />

          {/* Submit Button */}
          <Button
            htmlType="submit"
            loading={isPending}
            size="large"
            className="
              w-full
              rounded-xl
              bg-gradient-to-r
              from-purple-600
              via-indigo-600
              to-blue-600
              border-none
              font-semibold
              shadow-lg
              hover:scale-[1.02]
              hover:shadow-purple-500/40
              transition-all
              duration-300
            "
          >
            Sign In
          </Button>
        </form>

        {/* Error Message */}
        <div
          className="flex h-8 items-center space-x-2 mt-3"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-400">{errorMessage}</p>
            </>
          )}
        </div>

        {/* Bottom Links */}
        <div className="flex justify-between mt-6 text-xs sm:text-sm text-gray-400">
          <Link href="/forgotPassword" className="hover:text-white transition">
            Forgot password?
          </Link>
          <Link href="/signup" className="hover:text-white transition">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
