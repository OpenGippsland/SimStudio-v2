import React, { useState, useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

interface User {
  id: number;
  email: string;
  simulator_hours: number;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <Layout 
      selectedUserId={selectedUserId}
      onUserChange={handleUserChange}
      users={users}
    >
      <Component {...pageProps} selectedUserId={selectedUserId} />
    </Layout>
  );
}

export default MyApp;
