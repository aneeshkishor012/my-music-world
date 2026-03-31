import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from 'auth';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM categories ORDER BY sort_order, name');
        client.release();
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, name, description, image_url, sort_order } = await request.json();

        if (!id || !name) {
            return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO categories (id, name, description, image_url, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, name, description || '', image_url || '', sort_order || 0]
        );
        client.release();

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}