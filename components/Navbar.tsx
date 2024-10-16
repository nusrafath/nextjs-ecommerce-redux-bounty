'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { signOut, useSession } from 'next-auth/react';
import { FaShoppingCart } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">eCommerce Store</Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className={pathname === '/' ? 'font-bold' : ''}>Home</Link>
          <Link href="/products" className={pathname === '/products' ? 'font-bold' : ''}>Products</Link>
          {status === 'authenticated' && session?.user ? (
            <>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin/dashboard" className={pathname === '/admin/dashboard' ? 'font-bold' : ''}>
                  Admin Dashboard
                </Link>
              )}
              {session.user.role === 'SELLER' && (
                <Link href="/seller/dashboard" className={pathname === '/seller/dashboard' ? 'font-bold' : ''}>
                  Seller Dashboard
                </Link>
              )}
              <button onClick={handleSignOut} className="text-white">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={pathname === '/auth/signin' ? 'font-bold' : ''}>Sign In</Link>
              <Link href="/auth/register" className={pathname === '/auth/register' ? 'font-bold' : ''}>Register</Link>
            </>
          )}
          {(!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SELLER')) && (
            <Link href="/cart" className="relative">
              <FaShoppingCart className="text-2xl" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
