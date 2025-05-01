import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export default function Register() {
  const { data: session, status } = useSession();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();
  
  const { redirect, error: errorParam } = router.query;
  
  // Set error from URL parameter if present
  useEffect(() => {
    if (errorParam) {
      setError(String(errorParam));
    }
  }, [errorParam]);
  
  // Debug session status changes
  useEffect(() => {
    console.log('Session status changed:', status);
    console.log('Session data:', session);
    
    setDebugInfo({
      status,
      session: session ? JSON.stringify(session) : 'null'
    });
    
    // If authenticated, redirect
    if (status === 'authenticated' && session) {
      const redirectUrl = redirect 
        ? String(redirect)
        : localStorage.getItem('redirectTo') 
          ? localStorage.getItem('redirectTo')! 
          : '/booking';
      
      // Clean up redirectTo if it was used
      if (localStorage.getItem('redirectTo')) {
        localStorage.removeItem('redirectTo');
      }
      
      console.log('Authenticated, redirecting to:', redirectUrl);
      router.push(redirectUrl);
    }
  }, [status, session, redirect, router]);
  
  // Redirect if already logged in via AuthContext
  useEffect(() => {
    if (user) {
      const redirectUrl = redirect 
        ? String(redirect)
        : localStorage.getItem('redirectTo') 
          ? localStorage.getItem('redirectTo')! 
          : '/booking';
      
      // Clean up redirectTo if it was used
      if (localStorage.getItem('redirectTo')) {
        localStorage.removeItem('redirectTo');
      }
      
      console.log('User found in AuthContext, redirecting to:', redirectUrl);
      router.push(redirectUrl);
    }
  }, [user, redirect, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('Attempting to register with:', formData.email);
      
      // Determine the callback URL
      const callbackUrl = redirect 
        ? String(redirect)
        : localStorage.getItem('redirectTo') 
          ? localStorage.getItem('redirectTo')! 
          : '/booking';
      
      console.log('Using callback URL:', callbackUrl);
      
      // Use NextAuth's signIn method with credentials provider
      // Use redirect: false to handle the redirect ourselves
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mode: 'register',
        callbackUrl,
        redirect: false,
      });
      
      console.log('Registration result:', result);
      
      if (result?.error) {
        setError(result.error);
        console.error('Registration error from result:', result.error);
      } else if (result?.url) {
        // Clean up redirectTo if it was used
        if (localStorage.getItem('redirectTo')) {
          localStorage.removeItem('redirectTo');
        }
        
        // Successful registration, redirect to the URL
        console.log('Registration successful, redirecting to:', result.url);
        router.push(result.url);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to register. Please try again.');
      console.error('Registration error from exception:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Register - SimStudio</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <img 
            src="/assets/SimStudio Logo Main - Black Bg.png" 
            alt="SimStudio Logo" 
            className="h-12 mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating account...' : 'Register with Password'}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={async () => {
                if (!formData.email) {
                  setError('Please enter your email address');
                  return;
                }
                
                setLoading(true);
                setError('');
                
                try {
                  // Determine the callback URL
                  const callbackUrl = redirect 
                    ? String(redirect)
                    : localStorage.getItem('redirectTo') 
                      ? localStorage.getItem('redirectTo')! 
                      : '/booking';
                  
                  // Use NextAuth's signIn method with email provider
                  const result = await signIn('email', {
                    email: formData.email,
                    callbackUrl,
                    redirect: false,
                  });
                  
                  console.log('Magic link result:', result);
                  
                  if (result?.error) {
                    setError(result.error);
                  } else {
                    // Redirect to verify-email page
                    router.push('/auth/verify-email');
                  }
                } catch (error: any) {
                  setError(error.message || 'Failed to send verification email. Please try again.');
                  console.error('Email verification error:', error);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Register with Email Link'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                href={redirect ? `/auth/login?redirect=${encodeURIComponent(String(redirect))}` : "/auth/login"} 
                className="font-medium text-yellow-500 hover:text-yellow-400"
              >
                Sign in
              </Link>
            </p>
          </div>
          
          {/* Debug information */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <p>Session Status: {debugInfo.status}</p>
              <p className="mt-2">Session Data:</p>
              <pre className="overflow-auto max-h-32">{debugInfo.session}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
