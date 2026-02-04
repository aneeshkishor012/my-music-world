import bcrypt from "bcrypt";
import postgres from "postgres";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const SignupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});

let cachedHasPasswordOrg: boolean | null = null;
async function hasPasswordOrgColumn() {
    if (cachedHasPasswordOrg != null) return cachedHasPasswordOrg;

    const rows = await sql`
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND lower(column_name) = 'passwordorg'
        LIMIT 1
    `;

    cachedHasPasswordOrg = Array.isArray(rows) && rows.length > 0;
    return cachedHasPasswordOrg;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = SignupSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        // Check if user already exists
        const existing = await sql`
            SELECT id FROM users WHERE email = ${email} LIMIT 1
        `;

        if (existing.length > 0) {
            return Response.json(
                { error: "User with that email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = randomUUID();

        const inserted = (await hasPasswordOrgColumn())
            ? await sql`
                INSERT INTO users (id, name, email, password, passwordorg)
                VALUES (${id}, ${name}, ${email}, ${hashedPassword}, ${password})
                RETURNING id, name, email
            `
            : await sql`
                INSERT INTO users (id, name, email, password)
                VALUES (${id}, ${name}, ${email}, ${hashedPassword})
                RETURNING id, name, email
            `;

        return Response.json({ user: inserted[0] }, { status: 201 });
    } catch (err: any) {
        console.error("Signup error", err);

        if (err?.message?.includes('relation "users" does not exist')) {
            return Response.json(
                { error: "Users table is missing. Open /seed once to initialize the database." },
                { status: 500 }
            );
        }

        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
