import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Set a timeout to prevent endless loading
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError('Authentication is taking longer than expected. Please try logging in manually.');
      }, 10000); // 10 seconds timeout
      
      try {
        // Check if there's a redirect parameter in the URL
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirectTo');
        setRedirectUrl(redirectTo || '/booking');
        
        // Check if we have a session
        if (status === 'authenticated' && session) {
          // Successfully authenticated, redirect
          clearTimeout(timeoutId);
          router.push(redirectTo || '/booking');
        } else if (status === 'unauthenticated') {
          // No session found, show error
          setError('Authentication failed. Please try logging in again.');
          setLoading(false);
          clearTimeout(timeoutId);
        }
        // If status is 'loading', we'll wait for it to resolve
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('An error occurred during authentication. Please try again.');
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    handleAuthCallback();
  }, [router, session, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Issue</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <div className="space-y-4">
          <div>
            <Link 
              href="/auth/login" 
              className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
          {redirectUrl && (
            <div>
              <Link 
                href={redirectUrl} 
                className="block w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Return to Previous Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
