import React, { useState, useEffect } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface User {
  id: number;
  email: string;
  simulator_hours: number;
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch('/api/users')
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users')
        }
        const usersData = await usersResponse.json()
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value)
  }
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => router.pathname === path
  
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap space-x-2 md:space-x-8">
            <Link href="/" className={`px-4 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-blue-700 text-white' : 'hover:text-gray-300'}`}>
              Home
            </Link>
            <Link href="/bookings" className={`px-4 py-2 rounded-md transition-colors ${isActive('/bookings') ? 'bg-blue-700 text-white' : 'hover:text-gray-300'}`}>
              Bookings
            </Link>
            <Link href="/packages" className={`px-4 py-2 rounded-md transition-colors ${isActive('/packages') ? 'bg-blue-700 text-white' : 'hover:text-gray-300'}`}>
              Packages
            </Link>
            <Link href="/admin" className={`px-4 py-2 rounded-md transition-colors ${isActive('/admin') ? 'bg-blue-700 text-white' : 'hover:text-gray-300'}`}>
              Admin
            </Link>
            <Link href="/business-rules" className={`px-4 py-2 rounded-md transition-colors ${isActive('/business-rules') ? 'bg-blue-700 text-white' : 'hover:text-gray-300'}`}>
              Biz Rules
            </Link>
          </div>
          <div className="flex items-center">
            <label className="mr-2">Simulate User:</label>
            <select
              value={selectedUserId}
              onChange={handleChange}
              className="bg-gray-700 text-white p-2 rounded-md"
            >
              <option value="">No account / not logged in</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.email} (Credits: {user.simulator_hours} hours)
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Component {...pageProps} selectedUserId={selectedUserId} />
      </main>
    </div>
  )
}

export default MyApp
