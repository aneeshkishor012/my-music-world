import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Initialize with config only to keep it Edge-compatible
// (Avoids importing auth.ts which depends on bcrypt)
export const { auth: proxy } = NextAuth(authConfig);
