import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Next.js 16 convention: export as 'proxy' from 'proxy.ts'
export const proxy = NextAuth(authConfig).auth;
