import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from 'auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, description, price, discount_percent, rating, image_url, images, category_id, stock, is_active } = await request.json();
        const { id } = params;

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query(
            'UPDATE products SET name = $1, description = $2, price = $3, discount_percent = $4, rating = $5, image_url = $6, images = $7, category_id = $8, stock = $9, is_active = $10, updated_at = NOW() WHERE id = $11 RETURNING *',
            [name, description || '', price, discount_percent || 0, rating || 0, image_url || '', images || [], category_id || null, stock || 0, is_active !== false, id]
        );
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const client = await pool.connect();
        const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}