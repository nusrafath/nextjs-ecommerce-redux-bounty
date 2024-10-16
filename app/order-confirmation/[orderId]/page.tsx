'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
          <p className="font-bold">Order Placed Successfully!</p>
          <p>Your order ID is: {orderId}</p>
        </div>
        <p className="mb-4">Thank you for your purchase. We&apos;ve received your order and will process it shortly.</p>
        <p className="mb-8">You will receive an email confirmation with the order details.</p>
        <Link href="/" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Continue Shopping
        </Link>
      </main>
    </div>
  );
}
