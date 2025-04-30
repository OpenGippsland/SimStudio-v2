import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthTestSimple() {
  const { data: session, status } = useSession();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const handleLogin = async () => {
    try {
      console.log('Testing login with:', email);
      
      const loginResult = await signIn('credentials', {
        email,
        password,
        mode: 'login',
        redirect: false,
      });
      
      console.log('Login result:', loginResult);
      setResult(loginResult);
    } catch (error) {
      console.error('Login error:', error);
      setResult({ error });
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setResult({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      setResult({ error });
    }
  };
  
  return (
    <div className="min-h-screen p-8">
      <Head>
        <title>Simple Auth Test - SimStudio</title>
      </Head>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Simple Auth Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">NextAuth Session</h3>
              <div className="bg-gray-100 p-4 rounded">
                <p><strong>Status:</strong> {status}</p>
                {session && (
                  <>
                    <p className="mt-2"><strong>User Email:</strong> {session.user?.email}</p>
                    <p><strong>User ID:</strong> {(session.user as any)?.id}</p>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">AuthContext User</h3>
              <div className="bg-gray-100 p-4 rounded">
                {user ? (
                  <>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Created:</strong> {user.created_at}</p>
                  </>
                ) : (
                  <p>No user in AuthContext</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Test Login</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded"
              />
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
          
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Last Operation Result</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Link 
              href="/auth/login"
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
            >
              Go to Login Page
            </Link>
            <Link 
              href="/auth/register"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Register Page
            </Link>
            <Link 
              href="/auth-debug"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Go to Detailed Debug Page
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
