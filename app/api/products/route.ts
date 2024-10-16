import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { openDb } from '@/lib/db';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId');

  try {
    const db = await openDb();
    let products;
    if (sellerId) {
      products = await db.all('SELECT * FROM products WHERE seller_id = ?', [sellerId]);
    } else {
      products = await db.all('SELECT * FROM products');
    }
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { name, price, quantity, description } = await req.json();
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO products (name, price, quantity, description, seller_id) VALUES (?, ?, ?, ?, ?)',
      [name, price, quantity, description, session.user.id]
    );
    return NextResponse.json({ id: result.lastID, name, price, quantity, description, seller_id: session.user.id }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await req.json();
    const db = await openDb();

    for (const update of updates) {
      await db.run(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [update.quantity, update.id]
      );
    }

    return NextResponse.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Failed to update stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
