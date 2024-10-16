'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setProfile({
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role
      });
      setName(session.user.name || '');
    }
  }, [session, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, name } : null);
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        {profile && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="mb-2"><strong>Name:</strong> {profile.name}</p>
                <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
                <p className="mb-4"><strong>Role:</strong> {profile.role}</p>
                <button onClick={() => setIsEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
