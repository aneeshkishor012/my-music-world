import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

// Next.js 16 requires a named export 'proxy' or a default export.
// We use a named export 'proxy' to align with the file name.
export const proxy = auth;
