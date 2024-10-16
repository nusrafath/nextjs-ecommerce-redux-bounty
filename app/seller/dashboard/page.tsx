'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/store';
import { fetchProducts } from '@/store/productsSlice';
import Navbar from '@/components/Navbar';
import AddProductForm from '@/components/AddProductForm';
import ProductList from '@/components/ProductList';
import { useSession } from 'next-auth/react';

export default function SellerDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { items: products, status: productStatus, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (session?.user?.role === 'SELLER') {
        dispatch(fetchProducts(session.user.id));
      } else {
        router.push('/');
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, session, router, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'SELLER') {
    return null;
  }

  const handleProductAdded = () => {
    setShowAddProduct(false);
    dispatch(fetchProducts(session.user.id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
        <button
          onClick={() => setShowAddProduct(!showAddProduct)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          {showAddProduct ? 'Cancel' : 'Add New Product'}
        </button>
        {showAddProduct && <AddProductForm onProductAdded={handleProductAdded} sellerId={session.user.id} />}
        <ProductList products={products} status={productStatus} error={error} isSeller={true} />
      </main>
    </div>
  );
}
