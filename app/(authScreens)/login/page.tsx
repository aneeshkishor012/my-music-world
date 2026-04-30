import Image from "next/image";
import LoginForm from "./login-form";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">

            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(30,27,75)] via-[rgb(5,11,36)] to-black" />

            {/* Main Glass Card */}
            <div className="relative z-20 w-full max-w-5xl">

                <div className="
          backdrop-blur-2xl
          bg-[#0b1120]/85
          border border-white/10
          rounded-3xl
          shadow-[0_8px_40px_rgba(0,0,0,0.8)]
          overflow-hidden
        ">

                    {/* Responsive Layout */}
                    <div className="flex flex-col md:flex-row items-center">

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 flex items-center justify-center pt-6 pb-2 md:p-10">

                            <Image
                                src="/images/Boombox-pana.png"
                                alt="Music Illustration"
                                width={400}
                                height={400}
                                priority
                                unoptimized
                                className="w-[160px]  sm:w-[200px]  md:w-[300px]  object-contain  drop-shadow-[0_0_60px_rgba(139,92,246,0.4)] "
                            />

                        </div>


                        {/* Divider for Desktop */}
                        <div className="hidden md:block w-px h-[70%] bg-white/10" />

                        {/* Form Section */}
                        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">

                            <Suspense>
                                <LoginForm />
                            </Suspense>

                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
