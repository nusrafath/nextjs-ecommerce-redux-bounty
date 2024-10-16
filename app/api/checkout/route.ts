import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { openDb } from '@/lib/db';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items } = await req.json();
    const db = await openDb();

    // Start a transaction
    await db.run('BEGIN TRANSACTION');

    for (const item of items) {
      // Check if there's enough stock
      const product = await db.get('SELECT quantity FROM products WHERE id = ?', [item.id]);
      if (!product || product.quantity < item.quantity) {
        await db.run('ROLLBACK');
        return NextResponse.json({ error: `Not enough stock for product ${item.id}` }, { status: 400 });
      }

      // Update the stock
      await db.run('UPDATE products SET quantity = quantity - ? WHERE id = ?', [item.quantity, item.id]);
    }

    // Commit the transaction
    await db.run('COMMIT');

    return NextResponse.json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
