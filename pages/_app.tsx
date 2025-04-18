import React from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex space-x-8">
          <Link href="/" className="hover:text-gray-300 px-4 py-2">
            Home
          </Link>
          <Link href="/admin" className="hover:text-gray-300 px-4 py-2">
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
