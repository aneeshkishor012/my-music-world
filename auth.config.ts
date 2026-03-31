import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;
            const pathname =
                nextUrl.pathname.endsWith("/") && nextUrl.pathname !== "/"
                    ? nextUrl.pathname.slice(0, -1)
                    : nextUrl.pathname;

            // Define public, customer, and admin routes
            const publicRoutes = ["/", "/login", "/signup", "/welcome", "/seed"];
            const adminRoutes = [
                "/admin",
                "/admin/categories",
                "/admin/orders",
                "/admin/products",
                "/admin/users",
                // Add more admin routes as needed
            ];
            // You can expand customerRoutes if you want to restrict some customer-only pages
            // const customerRoutes = ["/cart", "/checkout", "/orders", "/products"];

            const isPublic = publicRoutes.includes(pathname);
            const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

            // Not logged in and not public: redirect to login
            if (!isLoggedIn && !isPublic) {
                return false;
            }

            // If logged in and visiting login/signup again → send to dashboard based on role
            if (isLoggedIn && ["/login", "/signup"].includes(nextUrl.pathname)) {
                if (userRole === "admin") {
                    return Response.redirect(new URL("/admin", nextUrl));
                } else {
                    return Response.redirect(new URL("/home", nextUrl));
                }
            }

            // Admin route protection
            if (isAdminRoute && userRole !== "admin") {
                // Not an admin, redirect to home
                return Response.redirect(new URL("/home", nextUrl));
            }

            // Optionally, add customer route protection here if needed

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
