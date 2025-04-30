import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Debug information
  useEffect(() => {
    console.log('AuthGuard - Session status:', status);
    console.log('AuthGuard - Session data:', session);
    console.log('AuthGuard - User data:', user);
    
    setDebugInfo({
      status,
      session: session ? JSON.stringify(session) : 'null',
      user: user ? JSON.stringify(user) : 'null',
      isRefreshing
    });
  }, [status, session, user, isRefreshing]);
  
  // Refresh user data when component mounts or session changes
  useEffect(() => {
    const refreshData = async () => {
      if (session && !user) {
        console.log('AuthGuard - Refreshing user data');
        setIsRefreshing(true);
        await refreshUser();
        setIsRefreshing(false);
        console.log('AuthGuard - User data refreshed');
      }
    };
    
    refreshData();
  }, [session, refreshUser, user]);
  
  useEffect(() => {
    // Save the current path for redirect after login
    if (status === 'unauthenticated' && !isRefreshing) {
      console.log('AuthGuard - Unauthenticated, redirecting to login');
      localStorage.setItem('redirectTo', router.asPath);
      router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [status, isRefreshing, router]);
  
  // If auth is still loading or refreshing, show loading state
  if (status === 'loading' || isRefreshing) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-600">Loading your account...</p>
        
        {/* Debug information */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-xs max-w-lg">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>Session Status: {debugInfo.status}</p>
            <p>Is Refreshing: {debugInfo.isRefreshing.toString()}</p>
            <p className="mt-2">Session Data:</p>
            <pre className="overflow-auto max-h-32">{debugInfo.session}</pre>
            <p className="mt-2">User Data:</p>
            <pre className="overflow-auto max-h-32">
              {debugInfo.user !== 'null' ? (() => {
                // Parse user data and filter out sensitive fields
                try {
                  const userData = JSON.parse(debugInfo.user);
                  // Only keep essential fields
                  const filteredData = {
                    id: userData.id,
                    email: userData.email,
                    created_at: userData.created_at,
                    updated_at: userData.updated_at
                  };
                  return JSON.stringify(filteredData, null, 2);
                } catch (e) {
                  return debugInfo.user;
                }
              })() : debugInfo.user}
            </pre>
          </div>
        )}
      </div>
    );
  }
  
  // If authenticated, render children
  if (session) {
    return <>{children}</>;
  }
  
  // If not authenticated and not loading, return null
  // The redirect effect will handle the navigation
  return null;
}
