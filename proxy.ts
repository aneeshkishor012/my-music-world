import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

// Next.js 16 requires a named export 'proxy' or a default export.
export const proxy = auth;

// RESTORE MATCHER: This prevents the proxy from intercepting static assets (JS/CSS)
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
