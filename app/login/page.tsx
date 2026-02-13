import Image from "next/image";
import LoginForm from "./login-form";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#050B24]">
            {/* Left: Background image */}
            <div className="hidden md:flex items-center justify-center p-10">
                <Image
                    src="/images/Boombox-bro.png"
                    alt="Login background"
                    width={900}
                    height={900}
                    priority
                    className="max-h-[80vh] w-auto max-w-full object-contain"
                    unoptimized
                />
            </div>

            {/* Right: Login form */}
            <div className="flex items-center justify-center bg-[#050B24] px-4 py-10">
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}
