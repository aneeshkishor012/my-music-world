"use client";

import { UserIcon, LockClosedIcon, XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button, Form, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { authenticate } from "../lib/actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050B24] text-white px-4">
      {/* Top Title */}
      <h1 className="text-lg sm:text-xl mb-6 text-center">Welcome to My Music World</h1>

      {/* Card */}
      <div
        className="w-full max-w-xs sm:max-w-sm md:max-w-md p-6 sm:p-8 rounded-xl"
        style={{ background: "linear-gradient(to bottom, #0B1A33, #3A134F)" }}
      >
        {/* SignIn Title */}
        <h2 className="text-center text-xl sm:text-2xl mb-4">SignIn</h2>

        {/* Signature */}
        <div className="text-center text-3xl sm:text-4xl italic mb-6 font-light">AK</div>

        {/* FORM (SERVER ACTIONS WORK HERE) */}
        <form action={formAction} className="space-y-4">
          {/* Username */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 mb-4">
            <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mr-2" />

            <Input
              name="email"
              placeholder="Username or phone......"
              className="bg-transparent text-white placeholder-gray-300 border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear
              required
            />

            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 mb-4">
            <LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mr-2" />

            <Input.Password
              name="password"
              placeholder="Password........"
              className="bg-transparent text-white placeholder-gray-300 border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear
              required
              minLength={6}
            />

            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
          </div>

          {/* Hidden RedirectTo Field */}
          <input type="hidden" name="redirectTo" value={callbackUrl} />

          {/* Submit Button */}
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={isPending}
            className="w-full"
            style={{
              // color: "white",
              border: "none",
            }}
          >
            Submit
          </Button>
        </form>

        {/* Error Message */}
        <div className="flex h-8 items-center space-x-1 mt-2" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>

        {/* Bottom Links */}
        <div className="flex justify-between mt-6 text-[12px] sm:text-sm">
          <Link href="/forgotPassword" className="cursor-pointer hover:underline">
            forgot password ?
          </Link>
          <Link href="/signup" className="cursor-pointer hover:underline">
            Signup ?
          </Link>
        </div>
      </div>
    </div>
  );
}
