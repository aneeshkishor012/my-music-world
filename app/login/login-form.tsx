"use client";

import { LockClosedIcon, XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { authenticate } from "../lib/actions";
import styles from "./login-form.module.css";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/welcome";

  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-white">
      {/* Top Title */}
      <h1 className="text-lg sm:text-xl mb-6 text-center">Welcome to My Music World</h1>

      {/* Card */}
      <div
        className="w-full p-6 sm:p-8 rounded-xl"
        style={{ background: "linear-gradient(to bottom, #0B1A33, #3A134F)" }}
      >
        {/* SignIn Title */}
        <h2 className="text-center text-xl sm:text-2xl mb-4">SignIn</h2>

        {/* Signature */}
        <div className="text-center text-3xl sm:text-4xl italic mb-6 font-light">AK</div>

        {/* FORM (SERVER ACTIONS WORK HERE) */}
        <form action={formAction} className={`${styles.loginForm} space-y-4`}>
          {/* Username */}
            <Input
              prefix={<LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 ant-input" />}
              name="email"
              placeholder="Username or phone......"
              className="bg-white/10 rounded-lg px-3 py-2 mb-4 text-white border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4" /> }}
              required
            />

          {/* Password */}
            <Input.Password
              prefix={<LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 ant-input" />}
              name="password"
              placeholder="Password........"
              className="bg-white/10 rounded-lg px-3 py-2 mb-4 text-white border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4" /> }}
              required
              minLength={6}
            />

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
