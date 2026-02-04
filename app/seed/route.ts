import bcrypt from "bcrypt";
import postgres from "postgres";
import { randomUUID } from "node:crypto";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";

export const dynamic = "force-dynamic";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
type SqlClient = any;

async function hasColumn(sqlClient: SqlClient, table: string, column: string) {
  const rows = await sqlClient`
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = ${table}
      AND column_name = ${column}
    LIMIT 1
  `;

  return Array.isArray(rows) && rows.length > 0;
}

async function seedUsers(sqlClient: SqlClient) {
  await sqlClient`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      passwordorg TEXT NOT NULL
    );
  `;

  const hasPasswordOrg = await hasColumn(sqlClient, "users", "passwordorg");

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      // IMPORTANT: user.password must be PLAIN TEXT here
      const plainPassword = user.password;
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      return sqlClient`
        INSERT INTO users (id, name, email, password, passwordorg)
        VALUES (
          ${user.id},
          ${user.name},
          ${user.email},
          ${hashedPassword},
          ${plainPassword}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices(sqlClient: SqlClient) {
  await sqlClient`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map((invoice) => {
      const id = randomUUID();
      return sqlClient`
        INSERT INTO invoices (id, customer_id, amount, status, date)
        VALUES (${id}, ${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedInvoices;
}

async function seedCustomers(sqlClient: SqlClient) {
  await sqlClient`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sqlClient`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue(sqlClient: SqlClient) {
  await sqlClient`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sqlClient`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await sql.begin((tx) => [
      seedUsers(tx),
      seedCustomers(tx),
      seedInvoices(tx),
      seedRevenue(tx),
    ]);

    return Response.json(
      {
        message: "Database seeded successfully",
        url: "http://127.0.0.1:3000/seed",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: any) {
    return Response.json(
      {
        error: "Failed to seed database",
        details: String(error?.message || error),
        url: "http://127.0.0.1:3000/seed",
      },
      { status: 500 },
    );
  }
}
