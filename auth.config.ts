import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Public routes (no auth required)
            const publicRoutes = ["/login", "/signup", "/welcome"];
            const isPublic = publicRoutes.includes(nextUrl.pathname);

            // Protect all other routes
            if (!isLoggedIn && !isPublic) {
                return false; // redirects to login
            }

            // If logged in and visiting login/signup again → send to welcome
            if (isLoggedIn && ["/login", "/signup"].includes(nextUrl.pathname)) {
                return Response.redirect(new URL("/welcome", nextUrl));
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
