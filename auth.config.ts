import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Public routes (no auth required)
            const publicRoutes = ["/", "/login", "/signup", "/welcome", "/seed"];
            const pathname =
                nextUrl.pathname.endsWith("/") && nextUrl.pathname !== "/"
                    ? nextUrl.pathname.slice(0, -1)
                    : nextUrl.pathname;
            const isPublic = publicRoutes.includes(pathname);

            // Protect all other routes
            if (!isLoggedIn && !isPublic) {
                return false; // redirects to login
            }

            // If logged in and visiting login/signup again → send to home
            if (isLoggedIn && ["/login", "/signup"].includes(nextUrl.pathname)) {
                return Response.redirect(new URL("/home", nextUrl));
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
