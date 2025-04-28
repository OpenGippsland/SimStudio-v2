import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  selectedUserId?: string;
  onUserChange?: (userId: string) => void;
  users?: any[];
}

const Layout = ({ 
  children, 
  title = 'SimStudio - Driver Training & Education',
  selectedUserId,
  onUserChange,
  users = []
}: LayoutProps) => {
  const router = useRouter();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => router.pathname === path;
  
  // Check if the selected user is an admin
  const isAdmin = selectedUserId === 'admin';
  
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUserChange) {
      onUserChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/assets/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
      </Head>
      
      {/* Navigation - Black */}
      <nav className="bg-simstudio-black text-white py-4">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-2 md:mb-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/assets/SimStudio Logo Main - Black Bg.png" 
                alt="SimStudio Logo" 
                className="h-8 md:h-10"
              />
            </Link>
          </div>
          
          <div className="flex flex-wrap space-x-1 md:space-x-6">
            <Link href="/" className={`px-3 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Home
            </Link>
            <Link href="/about" className={`px-3 py-2 rounded-md transition-colors ${isActive('/about') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              About Us
            </Link>
            <Link href="/booking" className={`px-3 py-2 rounded-md transition-colors ${isActive('/booking') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Booking
            </Link>
            <Link href="/contact" className={`px-3 py-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Contact
            </Link>
            <Link href="/blog" className={`px-3 py-2 rounded-md transition-colors ${isActive('/blog') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Blog
            </Link>
            <Link href="/shop" className={`px-3 py-2 rounded-md transition-colors ${isActive('/shop') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Shop
            </Link>
          </div>
          
          {/* User selection - only show for admin/development */}
          <div className="hidden md:flex items-center mt-2 md:mt-0">
            <label className="mr-2 text-sm">User:</label>
            <select
              value={selectedUserId || ''}
              onChange={handleUserChange}
              className="bg-gray-800 text-white text-sm p-1 rounded-md"
            >
              <option value="">Guest</option>
              <option value="admin">Admin User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.email} ({user.simulator_hours}h)
                </option>
              ))}
            </select>
          </div>
          
          {/* Admin Links - only show when admin is selected */}
          {isAdmin && (
            <div className="hidden md:block absolute top-16 right-4 bg-gray-800 p-3 rounded-md shadow-lg z-10">
              <h3 className="text-simstudio-yellow font-bold mb-2 text-sm">Admin Links</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin" className="text-white hover:text-simstudio-yellow text-sm block py-1">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/bookings" className="text-white hover:text-simstudio-yellow text-sm block py-1">
                    Manage Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/coach-availability" className="text-white hover:text-simstudio-yellow text-sm block py-1">
                    Coach Availability
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="text-white hover:text-simstudio-yellow text-sm block py-1">
                    Manage Packages
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      
      {/* Main Content - White */}
      <main className="flex-grow bg-white">
        {children}
      </main>
      
      {/* Footer - Black */}
      <footer className="bg-simstudio-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Logo and About */}
            <div>
              <img 
                src="/assets/SimStudio Logo Main - Black Bg.png" 
                alt="SimStudio Logo" 
                className="h-8 mb-4"
              />
              <p className="text-sm mb-4">
                South Melbourne studio opening May 2025. Our driving simulator training facility offers structured coaching, guided programs, and regular seat time.
              </p>
            </div>
            
            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-simstudio-yellow">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-simstudio-yellow transition-colors">About Us</Link></li>
                <li><Link href="/booking" className="hover:text-simstudio-yellow transition-colors">Book a Session</Link></li>
                <li><Link href="/contact" className="hover:text-simstudio-yellow transition-colors">Contact Us</Link></li>
                <li><Link href="/blog" className="hover:text-simstudio-yellow transition-colors">Blog</Link></li>
                <li><Link href="/shop" className="hover:text-simstudio-yellow transition-colors">Shop</Link></li>
              </ul>
            </div>
            
            {/* Column 3: Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-simstudio-yellow">Contact Us</h3>
              <p className="mb-2">South Melbourne, VIC</p>
              <p className="mb-2">
                <a href="mailto:hello@simstudio.com.au" className="hover:text-simstudio-yellow transition-colors">
                  hello@simstudio.com.au
                </a>
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="https://facebook.com/@simstudio.au" target="_blank" rel="noopener noreferrer" className="text-white hover:text-simstudio-yellow">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/simstudio.au" target="_blank" rel="noopener noreferrer" className="text-white hover:text-simstudio-yellow">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
            <p>Copyright © {new Date().getFullYear()} SimStudio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
