import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Logout() {
  const router = useRouter();
  
  // Redirect to home page after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Signed Out - SimStudio</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <img 
            src="/assets/SimStudio Logo Main - Black Bg.png" 
            alt="SimStudio Logo" 
            className="h-12 mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            You've been signed out
          </h2>
        </div>
        
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p className="text-center">
            You have successfully signed out of your account.
          </p>
          <p className="text-center text-sm mt-2">
            Redirecting to home page...
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Sign In Again
          </Link>
          
          <Link 
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
