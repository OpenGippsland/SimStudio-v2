import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  
  // State for dropdown menus and mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Helper functions to determine if a link is active
  const isActive = (path: string) => router.pathname === path;
  const isActiveOrSubpath = (path: string) => router.pathname === path || router.pathname.startsWith(`${path}/`);
  
  // Check if the user is an admin or coach
  const isAdmin = user?.is_admin === true;
  const isCoach = user?.is_coach === true;
  const shouldRedirectToAdmin = isAdmin || isCoach;
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  return (
    <nav className="bg-simstudio-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/assets/SimStudio Logo Main - Black Bg.png" 
                alt="SimStudio Logo" 
                className="h-8"
              />
            </Link>
          </div>
          
          {/* Mobile hamburger menu button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation - hidden on mobile */}
          <div className="hidden lg:flex flex-nowrap space-x-2 lg:space-x-6">
            <Link href="/" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Home
            </Link>
            <Link href="/about" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActiveOrSubpath('/about') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              About
            </Link>
            <Link href="/booking" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/booking') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Booking
            </Link>
            <Link href="/shop" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/shop') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Shop
            </Link>
            <Link href="/contact" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Contact
            </Link>
            {isAdmin && (
              <Link href="/style-guide" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/style-guide') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
                Style Guide
              </Link>
            )}
          </div>
          
          {/* Authentication buttons - desktop only */}
          <div className="hidden lg:flex items-center">
            {loading ? (
              <span className="text-sm">Loading...</span>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <Link href={shouldRedirectToAdmin ? "/admin" : "/my-account"} className="bg-simstudio-yellow text-black text-sm p-1 px-3 rounded-md hover:bg-yellow-400">
                  {shouldRedirectToAdmin ? "Admin" : "My Account"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-800 text-white text-sm p-1 px-3 rounded-md hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/login" className="bg-simstudio-yellow text-black text-sm p-1 px-3 rounded-md hover:bg-yellow-400">
                  Sign In
                </Link>
                <Link href="/auth/register" className="bg-gray-800 text-white text-sm p-1 px-3 rounded-md hover:bg-gray-700">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Admin Links section removed as requested */}
        </div>
        
        {/* Mobile navigation menu - toggled by state */}
        {mobileMenuOpen && (
          <>
            {/* Overlay to close menu when clicking outside */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            
            <div className="lg:hidden absolute top-14 right-4 bg-white z-50 p-6 shadow-lg border border-gray-800 rounded-md w-64">
              {/* Close button */}
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 mb-4"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
          <div className="flex flex-col items-center space-y-4 mt-12">
            <Link href="/" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Home
            </Link>
            <Link href="/about" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActiveOrSubpath('/about') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              About
            </Link>
            <Link href="/booking" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/booking') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Booking
            </Link>
            <Link href="/shop" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/shop') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Shop
            </Link>
            <Link href="/contact" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/contact') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Contact
            </Link>
            {isAdmin && (
              <Link href="/style-guide" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/style-guide') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
                Style Guide
              </Link>
            )}
            
            {/* Mobile authentication buttons */}
            {loading ? (
              <span className="text-base px-5 py-3 text-gray-800">Loading...</span>
            ) : user ? (
              <div className="flex flex-col items-center space-y-4 mt-4 w-full">
                <Link href={shouldRedirectToAdmin ? "/admin" : "/my-account"} className="w-full text-black text-base py-3 px-5 border-2 border-simstudio-yellow rounded-lg hover:bg-yellow-50 transition-all text-center">
                  {shouldRedirectToAdmin ? "Admin" : "My Account"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-black text-base py-3 px-5 border-2 border-black rounded-lg hover:bg-gray-50 transition-all text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 mt-4 w-full">
                <Link href="/auth/login" className="w-full text-black text-base py-3 px-5 border-2 border-simstudio-yellow rounded-lg hover:bg-yellow-50 transition-all text-center">
                  Sign In
                </Link>
                <Link href="/auth/register" className="w-full text-black text-base py-3 px-5 border-2 border-black rounded-lg hover:bg-gray-50 transition-all text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
