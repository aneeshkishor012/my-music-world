"use client";

import { Button } from "antd";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-gray-200 p-6 text-center">

            {/* Icon */}
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />

            {/* Error Title */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-gray-400 text-sm sm:text-base max-w-md mb-6">
                {error?.message || "An unexpected error has occurred. Please try again."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">

                {/* Retry */}
                <Button
                    size="large"
                    type="primary"
                    onClick={() => reset()}
                    className="rounded-lg font-semibold"
                >
                    Try Again
                </Button>

                {/* Back Home */}
                <a
                    href="/"
                    className="text-sm sm:text-base text-gray-300 hover:underline"
                >
                    Go back to Home →
                </a>
            </div>
        </div>
    );
}
