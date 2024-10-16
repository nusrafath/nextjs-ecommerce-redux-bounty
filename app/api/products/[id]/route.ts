import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { openDb } from '@/lib/db';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { name, price, quantity, description } = await req.json();
    const db = await openDb();
    const result = await db.run(
      'UPDATE products SET name = ?, price = ?, quantity = ?, description = ? WHERE id = ? AND seller_id = ?',
      [name, price, quantity, description, params.id, session.user.id]
    );
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Product not found or you do not have permission to update it' }, { status: 404 });
    }

    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [params.id]);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const db = await openDb();
    const result = await db.run('DELETE FROM products WHERE id = ? AND seller_id = ?', [params.id, session.user.id]);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Product not found or you do not have permission to delete it' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
