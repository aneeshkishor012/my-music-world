// Re-export the initialized `auth` handler so it matches Next.js route handler types.
// The `auth` export is created in the project-wide `auth.ts` file where NextAuth is initialized.
import { handlers } from "@/auth";

export const { GET, POST } = handlers;