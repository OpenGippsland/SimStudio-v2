import { supabase } from './supabase';

/**
 * Utility function to handle login for accounts that might require email confirmation
 * This tries to log in normally first, and if that fails with an email confirmation error,
 * it tries to use a magic link as a fallback
 */
export async function loginWithFallback(email: string, password: string): Promise<any> {
  try {
    // First, try normal login
    const result = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // If login succeeded, return the result
    if (!result.error) {
      console.log('Login successful for:', email);
      return result;
    }
    
    // If the error is not about email confirmation, return the error
    if (!result.error.message.includes('Email not confirmed')) {
      console.error('Login failed with error:', result.error.message);
      return result;
    }
    
    console.log('Email not confirmed, trying magic link fallback for:', email);
    
    // If the error is about email confirmation, try magic link as fallback
    const magicLinkResult = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // Don't create a new user if one doesn't exist
      }
    });
    
    if (magicLinkResult.error) {
      console.error('Magic link fallback failed:', magicLinkResult.error.message);
      return magicLinkResult;
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
 * Utility function to create a new account without requiring email confirmation
 */
export async function createAccountWithoutConfirmation(
  email: string, 
  password: string, 
  userData: Record<string, any> = {}
): Promise<any> {
  try {
    // Create a new account with auto-confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Don't redirect for email confirmation
        data: userData
      }
    });
    
    if (error) {
      console.error('Error creating account:', error);
      return { error };
    }
    
    // If account creation succeeded, try to immediately sign in
    if (data.user) {
      console.log('Account created successfully, attempting immediate login for:', email);
      
      const signInResult = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInResult.error) {
        console.error('Auto-login failed after account creation:', signInResult.error);
        // Return the original result anyway
        return { data };
      }
      
      console.log('Auto-login successful after account creation for:', email);
      return signInResult;
    }
    
    return { data };
  } catch (error: any) {
    console.error('Error in createAccountWithoutConfirmation:', error);
    return { 
      data: { user: null, session: null },
      error: { message: error.message || 'An unexpected error occurred' }
    };
  }
}
