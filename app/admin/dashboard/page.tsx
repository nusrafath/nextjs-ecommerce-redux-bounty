'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UserList from '@/components/UserList';
import AddUserForm from '@/components/AddUserForm';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAddUser, setShowAddUser] = useState(false);
  const [refreshUserList, setRefreshUserList] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  const handleUserAdded = () => {
    setShowAddUser(false);
    setRefreshUserList(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          {showAddUser ? 'Cancel' : 'Add New User'}
        </button>
        {showAddUser && <AddUserForm onUserAdded={handleUserAdded} />}
        <UserList refreshTrigger={refreshUserList} />
      </main>
    </div>
  );
}
