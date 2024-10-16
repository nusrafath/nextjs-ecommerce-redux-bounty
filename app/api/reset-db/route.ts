import { NextResponse } from 'next/server';
import { resetProductsTable } from '@/lib/db';

export async function GET() {
  try {
    await resetProductsTable();
    return NextResponse.json({ message: 'Products table reset successfully' });
  } catch (error) {
    console.error('Failed to reset products table:', error);
    return NextResponse.json({ error: 'Failed to reset products table' }, { status: 500 });
  }
}
