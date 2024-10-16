'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomeContent() {
  const { data: session, status } = useSession();
  
  console.log('Session status:', status);
  console.log('Session data:', session);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <p className="mb-4">Please sign in to access our store.</p>
        <Link href="/auth/signin" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign In
        </Link>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <div>
        <p className="mb-4">Welcome, {session.user.name || 'User'}!</p>
        <nav className="space-x-4">
          <Link href="/products" className="text-blue-500 hover:text-blue-700">Browse Products</Link>
          {session.user.role === 'SELLER' && (
            <Link href="/seller/dashboard" className="text-blue-500 hover:text-blue-700">Seller Dashboard</Link>
          )}
          {session.user.role === 'ADMIN' && (
            <Link href="/admin/dashboard" className="text-blue-500 hover:text-blue-700">Admin Dashboard</Link>
          )}
        </nav>
      </div>
    );
  }

  return <p>An unexpected error occurred. Please try again later.</p>;
}
