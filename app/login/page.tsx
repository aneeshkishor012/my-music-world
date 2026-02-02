import LoginForm from "./login-form";
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center">
            <div className="flex w-full  flex-col">
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}