"use client";

import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button, Form, Input } from "antd";

export default function ForgotPasswordForm() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050B24] text-white px-4">

      {/* Top Title */}
      <h1 className="text-lg sm:text-xl mb-6 text-center">
        Welcome to My Music World
      </h1>

      {/* Card */}
      <div
        className="w-full max-w-xs sm:max-w-sm md:max-w-md p-6 sm:p-8 rounded-xl"
        style={{ background: "linear-gradient(to bottom, #0B1A33, #3A134F)" }}
      >
        {/* Forgot Password Title */}
        <h2 className="text-center text-xl sm:text-2xl mb-4">Forgot Password</h2>

        {/* Signature */}
        <div className="text-center text-3xl sm:text-4xl italic mb-6 font-light">AK</div>

        {/* Form */}
        <Form layout="vertical" className="space-y-4">

          {/* Email / Username Input */}
          <Form.Item name="user" className="!mb-6">
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mr-2" />

              <Input
                placeholder="Enter your email or username"
                bordered={false}
                className="bg-transparent text-white placeholder-gray-300 outline-none shadow-none"
              />

              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 cursor-pointer" />
            </div>
          </Form.Item>

          {/* Submit Button */}
          <Button
            style={{ alignSelf: "center", textAlign: "center", width: "100%", background: "white", opacity: 0.1 }}
            size="large"
          >
            Send OTP
          </Button>
        </Form>

        {/* Bottom Link */}
        <div className="flex justify-end mt-6 text-[12px] sm:text-sm">
          <Link href="/login" className="cursor-pointer hover:underline">
            Signin ?
          </Link>
        </div>
      </div>
    </div>
  );
}
