import React from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => router.pathname === path
  
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-wrap space-x-2 md:space-x-8">
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
        </div>
      </nav>
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
