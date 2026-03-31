import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
import { auth } from 'auth';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');

        const client = await pool.connect();
        let query = `
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `;
        const params: any[] = [];

        if (limit) {
            query += ' LIMIT $1';
            params.push(parseInt(limit));
        }

        const result = await client.query(query, params);
        client.release();
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, name, description, price, discount_percent, rating, image_url, images, category_id, stock, is_active } = await request.json();

        if (!id || !name || price === undefined) {
            return NextResponse.json({ error: 'ID, name, and price are required' }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO products (id, name, description, price, discount_percent, rating, image_url, images, category_id, stock, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [id, name, description || '', price, discount_percent || 0, rating || 0, image_url || '', images || [], category_id || null, stock || 0, is_active !== false]
        );
        client.release();

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}