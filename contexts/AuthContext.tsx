import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { getUserByEmail, createUser } from '../lib/db-supabase';

interface SimStudioUser {
  id: number;
  email: string;
  created_at: string | null;
  updated_at: string | null;
}

interface NextAuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

type AuthContextType = {
  session: Session | null;
  authUser: NextAuthUser | null;
  user: SimStudioUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: nextAuthSession, status } = useSession();
  const [user, setUser] = useState<SimStudioUser | null>(null);
  const loading = status === 'loading';
  
  // Function to sync NextAuth user with our users table
  const syncUserWithDatabase = async (email: string) => {
    try {
      console.log('Syncing user with database:', email);
      
      // Check if user exists in our database
      let dbUser = await getUserByEmail(email);
      
      // If not, create a new user
      if (!dbUser) {
        console.log('User not found in database, creating new user');
        dbUser = await createUser({ email });
      }
      
      console.log('User synced with database:', dbUser.id);
      setUser(dbUser as SimStudioUser);
    } catch (error) {
      console.error('Error syncing user with database:', error);
    }
  };
  
  useEffect(() => {
    // When NextAuth session changes, sync with database
    if (nextAuthSession?.user?.email) {
      // Only sync if we don't already have a user with the same email
      if (!user || user.email !== nextAuthSession.user.email) {
        console.log('NextAuth session changed, syncing user');
        syncUserWithDatabase(nextAuthSession.user.email);
      }
    } else {
      console.log('No NextAuth session, clearing user');
      setUser(null);
    }
  }, [nextAuthSession, user]);
  
  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting to sign in with:', email);
      
      // Use NextAuth's signIn method with credentials provider
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        mode: 'login',
        redirect: false,
      });
      
      console.log('AuthContext: Sign in result:', result);
      
      if (result?.error) {
        console.error('AuthContext: Sign in error:', result.error);
        
        // If credentials login failed, try magic link
        if (result.error.includes('Invalid credentials')) {
          console.log('AuthContext: Trying magic link fallback');
          const magicLinkResult = await nextAuthSignIn('email', {
            email,
            redirect: false,
          });
          
          return {
            data: {
              user: null,
              session: null,
              magicLinkSent: true,
              message: 'A magic link has been sent to your email. Please check your inbox to complete login.'
            },
            error: null
          };
        }
        
        return {
          data: { user: null, session: null },
          error: { message: result.error }
        };
      }
      
      // Login was successful
      return {
        data: {
          user: nextAuthSession?.user || null,
          session: nextAuthSession
        },
        error: null
      };
    } catch (error: any) {
      console.error('AuthContext: Error in signIn:', error);
      return { 
        error: { message: error.message || 'An unexpected error occurred' }, 
        data: { user: null, session: null } 
      };
    }
  };
  
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('AuthContext: Attempting to sign up with:', email);
      
      // Use NextAuth's signIn method with credentials provider in register mode
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        firstName,
        lastName,
        mode: 'register',
        redirect: false,
      });
      
      console.log('AuthContext: Sign up result:', result);
      
      if (result?.error) {
        return {
          data: { user: null, session: null },
          error: { message: result.error }
        };
      }
      
      // Registration was successful
      return {
        data: {
          user: nextAuthSession?.user || null,
          session: nextAuthSession
        },
        error: null
      };
    } catch (error: any) {
      console.error('AuthContext: Error in signUp:', error);
      return { 
        error: { message: error.message || 'An unexpected error occurred' }, 
        data: { user: null, session: null } 
      };
    }
  };
  
  const signOut = async () => {
    console.log('AuthContext: Signing out');
    await nextAuthSignOut({ redirect: false });
    setUser(null);
  };
  
  const refreshUser = async () => {
    try {
      if (nextAuthSession?.user?.email) {
        console.log('AuthContext: Refreshing user data');
        await syncUserWithDatabase(nextAuthSession.user.email);
      }
    } catch (error) {
      console.error('AuthContext: Error refreshing user:', error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      session: nextAuthSession, 
      authUser: nextAuthSession?.user as NextAuthUser || null, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
