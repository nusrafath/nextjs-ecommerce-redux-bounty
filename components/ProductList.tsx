'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Product, deleteProduct } from '@/store/productsSlice';
import { addToCart } from '@/store/cartSlice';
import { FaEdit, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import EditProductForm from './EditProductForm';

interface ProductListProps {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isSeller?: boolean;
}

export default function ProductList({ products, status, error, isSeller = false }: ProductListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: session } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartQuantity = cartItems.find(item => item.id === product.id)?.quantity || 0;
    if (cartQuantity < product.quantity) {
      dispatch(addToCart({ ...product, quantity: 1 }));
    } else {
      alert('Cannot add more of this item. Stock limit reached.');
    }
  };

  const handleBuyNow = (product: Product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    if (session?.user) {
      router.push('/checkout');
    } else {
      router.push('/auth/signin?redirect=/checkout');
    }
  };

  if (status === 'loading') {
    return <div>Loading products...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => {
        const cartQuantity = cartItems.find(item => item.id === product.id)?.quantity || 0;
        const availableStock = product.quantity - cartQuantity;

        return (
          <div key={product.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
            {availableStock > 0 ? (
              <p className="text-md mb-2">Available: {availableStock}</p>
            ) : (
              <p className="text-red-500 font-bold mb-2">Out of Stock</p>
            )}
            {isSeller ? (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ) : session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SELLER' ? (
              availableStock > 0 ? (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
                    disabled
                  >
                    Out of Stock
                  </button>
                </div>
              )
            ) : null}
          </div>
        );
      })}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
