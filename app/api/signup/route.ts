import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const SignupSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Ensure table exists
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    // Check if user exists by email
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing && existing.length > 0) {
      return Response.json({ error: 'User with that email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const inserted = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name || ''}, ${email}, ${hashed})
      RETURNING id, name, email;
    `;

    const user = inserted && inserted[0] ? inserted[0] : null;

    return Response.json({ user }, { status: 201 });
  } catch (err) {
    console.error('Signup error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
