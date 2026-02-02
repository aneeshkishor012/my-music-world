import { Suspense } from 'react';
import ForgotPasswordForm from './forgot-password-form';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center">
            <div className="flex w-full  flex-col">
                <Suspense>
                    <ForgotPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}