"use client";

import { UserIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { signIn as nextAuthSignIn } from 'next-auth/react';

export default function SignUpForm() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    const { name, email, password, confirmPassword } = values;
    if (!name || !email || !password) {
      message.error('Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        // If validation errors were returned as an object
        if (data?.error && typeof data.error === 'object') {
          const firstErr = Object.values(data.error).flat()[0];
          const errMsg = typeof firstErr === 'string' ? firstErr : (firstErr ? JSON.stringify(firstErr) : 'Signup failed');
          message.error(errMsg);
        } else {
          const errMsg = typeof data?.error === 'string' ? data.error : (data?.error ? String(data.error) : 'Signup failed');
          message.error(errMsg);
        }
        return;
      }

      // Attempt automatic sign in using NextAuth credentials provider
      const signInResult = await nextAuthSignIn('credentials', {
        redirect: false,
        email,
        password,
      } as any) as any;

      if ((signInResult as any)?.error) {
        // If automatic sign-in failed, fallback to manual sign-in page
        message.success('Signup successful — please sign in');
        router.push('/login');
        return;
      }

      // On success, navigate to welcome or home
      message.success('Signup successful — signed in');
      router.push('/welcome');
    } catch (err) {
      console.error(err);
      message.error('Signup failed');
    }
  };

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
        {/* SignUp Title */}
        <h2 className="text-center text-xl sm:text-2xl mb-4">SignUp</h2>

        {/* Signature */}
        <div className="text-center text-3xl sm:text-4xl italic mb-6 font-light">AK</div>

        {/* Form */}
        <Form layout="vertical" className="space-y-4" onFinish={onFinish}>

          <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]} className="!mb-4">
            <Input
              prefix={<UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mr-2 ant-input" />}
              placeholder="Full name"
              className="bg-white/10 rounded-lg px-3 py-2  text-white border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4" /> }}
              required
            />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Enter a valid email' }]} className="!mb-4">
            <Input
              prefix={<UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mr-2" />}
              placeholder="Email"
              className="bg-white/10 rounded-lg px-3 py-2  text-white border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4" /> }}
              required
            />
          </Form.Item>

          {/* Password */}
          <Form.Item name="password" rules={[{ required: true, message: 'Please enter a password' }]} className="!mb-4">
            <Input.Password
              prefix={<LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mr-2" />}
              placeholder="Password"
              className="bg-white/10 rounded-lg px-3 py-2  text-white border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4" /> }}
              required
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Please confirm password' }]} className="!mb-6">

            <Input.Password
              prefix={<LockClosedIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 mr-2" />}
              placeholder="Confirm Password"
              className="bg-white/10 rounded-lg px-3 py-2  text-white border-none shadow-none focus:outline-none"
              variant="borderless"
              allowClear={{ clearIcon: <XMarkIcon className="w-4 h-4" /> }}
              required
            />
          </Form.Item>

          {/* Submit Button */}
          <Button
            htmlType="submit"
            style={{ alignSelf: "center", textAlign: "center", width: "100%", background: "white", opacity: 0.1 }}
            size="large"
          >
            Submit
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