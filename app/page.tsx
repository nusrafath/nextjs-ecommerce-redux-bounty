'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchProducts } from '@/store/productsSlice';
import Navbar from '@/components/Navbar';
import ProductList from '@/components/ProductList';
import { FaShippingFast, FaLock, FaMedal } from 'react-icons/fa';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our eCommerce Store</h1>
            <p className="text-xl mb-8">Discover amazing products at unbeatable prices!</p>
            <Link href="/products" className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-100 transition duration-300">
              Shop Now
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
            <ProductList products={products.slice(0, 6)} status={status} error={error} />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <FaShippingFast className="text-5xl mb-4 mx-auto text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                <p className="text-gray-600">Get your products delivered quickly and efficiently.</p>
              </div>
              <div className="text-center">
                <FaLock className="text-5xl mb-4 mx-auto text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">Shop with confidence using our secure payment methods.</p>
              </div>
              <div className="text-center">
                <FaMedal className="text-5xl mb-4 mx-auto text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-600">We offer only the best quality items for our customers.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Our eCommerce Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
