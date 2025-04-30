import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthTest() {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);
  
  const handleLogin = async () => {
    // Special case for test user
    await signIn('credentials', {
      email: 'shane+so@omniat.com.au',
      password: 'any-password-will-work',
      mode: 'login',
      redirect: false,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Auth Test - SimStudio</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            NextAuth Test Page
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Testing NextAuth integration
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Session Status: {status}</h2>
          
          {session ? (
            <div className="space-y-4">
              <div className="bg-green-100 p-4 rounded-md">
                <p className="font-medium text-green-800">Authenticated as:</p>
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
              
              <button
                onClick={() => signOut({ redirect: false })}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
              
              <Link 
                href="/bookings"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Bookings Page
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-md">
                <p className="font-medium text-yellow-800">Not authenticated</p>
                <p className="text-sm mt-1">Click the button below to sign in with the test user.</p>
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Sign In as Test User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
