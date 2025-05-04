import { signIn } from 'next-auth/react';

/**
 * Utility function to handle login with NextAuth
 * This tries to log in with credentials first, and if that fails,
 * it tries to use a magic link as a fallback
 */
export async function loginWithFallback(email: string, password: string): Promise<any> {
  try {
    // First, try normal login with credentials
    const result = await signIn('credentials', {
      email,
      password,
      mode: 'login',
      redirect: false,
    });
    
    // If login succeeded, return the result
    if (!result?.error) {
      console.log('Login successful for:', email);
      return {
        data: { 
          user: { email },
          session: true
        },
        error: null
      };
    }
    
    console.log('Login failed, trying magic link fallback for:', email);
    
    // If credentials login failed, try magic link
    const magicLinkResult = await signIn('email', {
      email,
      redirect: false,
    });
    
    if (magicLinkResult?.error) {
      console.error('Magic link fallback failed:', magicLinkResult.error);
      return {
        data: { user: null, session: null },
        error: { message: magicLinkResult.error }
      };
    }
    
    console.log('Magic link sent successfully to:', email);
    
    // Return a custom result indicating magic link was sent
    return {
      data: { 
        user: null, 
        session: null,
        magicLinkSent: true 
      },
      error: null
    };
  } catch (error: any) {
    console.error('Error in loginWithFallback:', error);
    return { 
      data: { user: null, session: null },
      error: { message: error.message || 'An unexpected error occurred' }
    };
  }
}

/**
 * Utility function to create a new account with NextAuth
 */
export async function createAccountWithoutConfirmation(
  email: string, 
  password: string, 
  userData: Record<string, any> = {}
): Promise<any> {
  try {
    // Create a new account using NextAuth credentials provider in register mode
    const result = await signIn('credentials', {
      email,
      password,
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      mode: 'register',
      redirect: false,
    });
    
    if (result?.error) {
      console.error('Error creating account:', result.error);
      return { 
        error: { message: result.error }
      };
    }
    
    console.log('Account created successfully for:', email);
    return {
      data: { 
        user: { email },
        session: true
      },
      error: null
    };
  } catch (error: any) {
    console.error('Error in createAccountWithoutConfirmation:', error);
    return { 
      data: { user: null, session: null },
      error: { message: error.message || 'An unexpected error occurred' }
    };
  }
}
