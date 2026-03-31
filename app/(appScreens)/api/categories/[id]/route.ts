import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from 'auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, description, image_url, sort_order } = await request.json();
        const { id } = params;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const client = await pool.connect();
        const result = await client.query(
            'UPDATE categories SET name = $1, description = $2, image_url = $3, sort_order = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [name, description || '', image_url || '', sort_order || 0, id]
        );
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
        const result = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}