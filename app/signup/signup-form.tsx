"use client";

import {
  UserIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { useState } from "react";

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const { name, email, password, confirmPassword } = values;

    if (!name || !email || !password) {
      message.error("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true); // 🔥 START LOADING

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        message.error(data?.error || "Signup failed");
        return;
      }

      const signInResult = (await nextAuthSignIn("credentials", {
        redirect: false,
        email,
        password,
      })) as any;

      if (signInResult?.error) {
        setLoading(false);
        message.success("Signup successful — please sign in");
        router.push("/login");
        return;
      }

      message.success("Signup successful — signed in");
      router.push("/welcome");
    } catch (err) {
      console.error(err);
      message.error("Signup failed");
      setLoading(false);
    }
  };


  return (
    <div className="w-full text-white">

      {/* Title */}
      <h2 className="text-center text-2xl font-semibold mb-2 tracking-wide">
        Create Account
      </h2>

      <p className="text-center text-sm text-gray-400 mb-6">
        Join My Music World 🎵
      </p>

      {/* Form */}
      <Form layout="vertical" className="space-y-5" onFinish={onFinish}>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
          className="!mb-4"
        >
          <Input
            prefix={<UserIcon className="w-5 h-5 text-gray-400" />}
            placeholder="Full name"
            variant="borderless"
            allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 text-gray-400" /> }}
            className="!bg-white/5 hover:!bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 text-white border border-white/10 backdrop-blur-md"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
          className="!mb-4"
        >
          <Input
            prefix={<UserIcon className="w-5 h-5 text-gray-400" />}
            placeholder="Email"
            variant="borderless"
            allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 text-gray-400" /> }}
            className="!bg-white/5 hover:!bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 text-white border border-white/10 backdrop-blur-md"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please enter a password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
          className="!mb-4"
        >
          <Input.Password
            prefix={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            placeholder="Password"
            variant="borderless"
            allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 text-gray-400" /> }}
            className="!bg-white/5 hover:!bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 text-white border border-white/10 backdrop-blur-md"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm password" },
            { min: 8, message: "Password must be at least 8 characters" }
          ]}
          className="!mb-6"
        >
          <Input.Password
            prefix={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            placeholder="Confirm password"
            variant="borderless"
            allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4 text-gray-400" /> }}
            className="!bg-white/5 hover:!bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 text-white border border-white/10 backdrop-blur-md"
          />
        </Form.Item>

        <Button
          htmlType="submit"
          size="large"
          loading={loading}     // 🔥 shows spinner
          disabled={loading}    // 🔥 prevents multiple clicks
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
          {loading ? "Creating Account..." : "Sign Up & Login"}
        </Button>


      </Form>

      {/* Bottom Link */}
      <div className="flex justify-end mt-6 text-sm text-gray-400">
        <Link href="/login" className="hover:text-white transition">
          Already have an account?
        </Link>
      </div>

    </div>
  );

}
