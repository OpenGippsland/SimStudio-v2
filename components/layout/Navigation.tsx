import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => router.pathname === path;
  
  // Check if the user is an admin or coach
  const isAdmin = user?.is_admin === true;
  const isCoach = user?.is_coach === true;
  const shouldRedirectToAdmin = isAdmin || isCoach;
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

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
            <label htmlFor="menu-toggle" className="cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          
          {/* Desktop navigation - hidden on mobile */}
          <div className="hidden lg:flex flex-nowrap space-x-2 lg:space-x-6">
            <Link href="/" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Home
            </Link>
            <Link href="/about" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/about') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              About Us
            </Link>
            <Link href="/booking" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/booking') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Booking
            </Link>
            <Link href="/contact" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Contact
            </Link>
            <Link href="/blog" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/blog') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Blog
            </Link>
            <Link href="/shop" className={`px-2 lg:px-3 py-2 rounded-md transition-colors ${isActive('/shop') ? 'bg-simstudio-yellow text-black font-medium' : 'hover:text-simstudio-yellow'}`}>
              Shop
            </Link>
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
        
        {/* Checkbox for mobile menu toggle */}
        <input type="checkbox" id="menu-toggle" className="hidden peer" />
        
        {/* Mobile navigation menu - toggled by checkbox */}
        <div className="hidden peer-checked:block lg:hidden absolute top-14 right-4 bg-white z-10 p-6 shadow-lg border border-gray-800 rounded-md w-64">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Home
            </Link>
            <Link href="/about" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/about') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              About Us
            </Link>
            <Link href="/booking" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/booking') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Booking
            </Link>
            <Link href="/contact" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/contact') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Contact
            </Link>
            <Link href="/blog" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/blog') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Blog
            </Link>
            <Link href="/shop" className={`w-full px-5 py-3 rounded-md transition-colors text-center text-base ${isActive('/shop') ? 'bg-simstudio-yellow text-black font-medium' : 'text-gray-800 hover:text-simstudio-yellow'}`}>
              Shop
            </Link>
            
            {/* Mobile authentication buttons */}
            {loading ? (
              <span className="text-base px-5 py-3 text-gray-800">Loading...</span>
            ) : user ? (
              <div className="flex flex-col items-center space-y-4 mt-4 w-full">
                <Link href={shouldRedirectToAdmin ? "/admin" : "/my-account"} className="w-full bg-simstudio-yellow text-black text-base py-3 px-5 rounded-md hover:bg-yellow-400 text-center">
                  {shouldRedirectToAdmin ? "Admin" : "My Account"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-gray-800 text-white text-base py-3 px-5 rounded-md hover:bg-gray-700 text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 mt-4 w-full">
                <Link href="/auth/login" className="w-full bg-simstudio-yellow text-black text-base py-3 px-5 rounded-md hover:bg-yellow-400 text-center">
                  Sign In
                </Link>
                <Link href="/auth/register" className="w-full bg-gray-800 text-white text-base py-3 px-5 rounded-md hover:bg-gray-700 text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
