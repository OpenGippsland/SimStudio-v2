import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthDebug() {
  const { data: session, status } = useSession();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [providers, setProviders] = useState<any>(null);
  
  useEffect(() => {
    // Fetch CSRF token
    fetch('/api/auth/csrf')
      .then(res => res.json())
      .then(data => {
        console.log('CSRF token:', data);
        setCsrfToken(data.csrfToken);
      });
    
    // Fetch providers
    fetch('/api/auth/providers')
      .then(res => res.json())
      .then(data => {
        console.log('Providers:', data);
        setProviders(data);
      });
    
    // Log session status
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);
  
  const handleTestLogin = async () => {
    console.log('Testing login with test user...');
    
    try {
      const result = await signIn('credentials', {
        email: 'shane+so@omniat.com.au',
        password: 'any-password-will-work',
        mode: 'login',
        callbackUrl: '/bookings',
        redirect: false,
      });
      
      console.log('Login result:', result);
      
      if (result?.ok) {
        window.location.href = result.url || '/bookings';
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const handleDirectLogin = async () => {
    console.log('Testing direct login with test user...');
    
    try {
      const response = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'shane+so@omniat.com.au',
          password: 'any-password-will-work',
          mode: 'login',
          csrfToken,
          callbackUrl: '/bookings',
          json: true,
        }),
      });
      
      const data = await response.json();
      console.log('Direct login response:', data);
      
      if (response.ok) {
        window.location.href = data.url || '/bookings';
      }
    } catch (error) {
      console.error('Direct login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen p-8">
      <Head>
        <title>Auth Debug - SimStudio</title>
      </Head>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">NextAuth Debug Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Session Status: {status}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Session Data</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                {JSON.stringify(session, null, 2) || 'No session data'}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">CSRF Token</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {csrfToken || 'Loading...'}
              </pre>
              
              <h3 className="text-lg font-medium mt-4 mb-2">Available Providers</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                {providers ? JSON.stringify(providers, null, 2) : 'Loading...'}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleTestLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Login (signIn function)
              </button>
              
              <button
                onClick={handleDirectLogin}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Test Direct Login (fetch API)
              </button>
              
              <button
                onClick={() => signOut({ redirect: false })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/auth/login"
                className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 text-center"
              >
                Go to Login Page
              </Link>
              
              <Link 
                href="/bookings"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
              >
                Go to Bookings Page
              </Link>
              
              <Link 
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
              >
                Go to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
