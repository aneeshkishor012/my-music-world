import bcrypt from "bcrypt";
import postgres from "postgres";
import { randomUUID } from "node:crypto";
import { invoices, customers, revenue, categorySeeds, users, mockProducts } from "../lib/placeholder-data";

type CategorySeed = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    sort_order?: number;
    is_active?: boolean;
    parent_id?: string;
};

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

async function seedCategory(sqlClient: SqlClient) {
    await sqlClient`
        CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            image_url TEXT,
            parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const insertedCategory = await Promise.all(
        (categorySeeds as CategorySeed[]).map(
            (category) => sqlClient`
                INSERT INTO categories 
                (id, name, slug, description, image_url, parent_id, is_active)
                VALUES (
                    ${category.id},
                    ${category.name},
                    ${category.slug},
                    ${category.description || null},
                    ${category.image_url || null},
                    ${'parent_id' in category ? category.parent_id || null : null},
                    ${'is_active' in category ? category.is_active : true}
                )
                ON CONFLICT (id) DO NOTHING;
            `,
        ),
    );

    return insertedCategory;
}

async function seedProducts(sqlClient: SqlClient) {
    await sqlClient`
        CREATE TABLE IF NOT EXISTS products (
            unit VARCHAR(100) PRIMARY KEY,
            id VARCHAR(50),
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            discount_percentage INT DEFAULT 0,
            rating DECIMAL(3,1),
            main_image TEXT,
            images TEXT[],
            category_id VARCHAR(255),
            stock INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // Ensure unique slugs
    const usedSlugs = new Set();
    // Build a map of category name (lowercased, trimmed) to trimmed category id for easy lookup
    const categoryNameToId: Record<string, string> = {};
    for (const cat of categorySeeds as CategorySeed[]) {
        if (cat.name && cat.id) {
            categoryNameToId[String(cat.name).toLowerCase().trim()] = String(cat.id).trim();
        }
    }

    const insertedProducts = await Promise.all(
        mockProducts.map((product) => {
            const trimmedId = product.id ? String(product.id).trim() : '';
            let baseSlug = product.name.toLowerCase().replace(/\s+/g, '-');
            let slug = baseSlug;
            // If slug already used, append product id
            if (usedSlugs.has(slug)) {
                slug = `${baseSlug}-${trimmedId}`;
            }
            usedSlugs.add(slug);

            // Map category_id to the trimmed category id from the categories table
            let categoryId = null;
            if (product.category) {
                const catKey = String(product.category).toLowerCase().trim();
                categoryId = categoryNameToId[catKey] || null;
            }
            if (categoryId) categoryId = String(categoryId).trim();

            const main_image = product.image || null;
            const images = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);
            const discount_percentage = product.discountDetails || 0;
            const rating = product.rating || null;
            const stock = 'stock' in product && typeof product.stock === 'number' ? product.stock : 0;
            const is_active = 'is_active' in product ? (product as any).is_active : true;
            // Create a unique unit key (e.g., slug + id)
            const unit = `${slug}-${trimmedId}`;

            return sqlClient`
                INSERT INTO products 
                (unit, id, name, slug, description, price, discount_percentage, rating, main_image, images, category_id, stock, is_active)
                VALUES (
                    ${unit},
                    ${trimmedId},
                    ${product.name},
                    ${slug},
                    ${product.description},
                    ${product.price},
                    ${discount_percentage},
                    ${rating},
                    ${main_image},
                    ${images},
                    ${categoryId},
                    ${stock},
                    ${is_active}
                )
                ON CONFLICT (unit) DO NOTHING;
            `;
        })
    );

    return insertedProducts;
}

export async function GET() {
    try {
        await sql.begin((tx) => [
            // seedUsers(tx),
            seedCustomers(tx),
            seedInvoices(tx),
            seedRevenue(tx),
            seedCategory(tx),
            seedProducts(tx)
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
