import { Suspense } from 'react';
import SignUpForm from './signup-form';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center">
            <div className="flex w-full  flex-col">
                <Suspense>
                    <SignUpForm />
                </Suspense>
            </div>
        </main>
    );
}