import { squareClient } from './square';
import { supabase } from './supabase';

/**
 * Creates or updates a Square customer record and links it to a Supabase user
 * @param user The Supabase user object
 * @returns The Square customer ID
 */
export async function createOrUpdateSquareCustomer(user: any): Promise<string> {
  try {
    // Check if user already has a Square customer ID in their user record
    const { data: userData } = await supabase
      .from('users')
      .select('square_customer_id')
      .eq('id', user.id)
      .single();
    
    if (userData?.square_customer_id) {
      // For now, just return the existing ID
      // In a real implementation, we would update the customer in Square
      console.log('Using existing Square customer ID:', userData.square_customer_id);
      return userData.square_customer_id;
    } else {
      // In a real implementation, we would create a customer in Square
      // For now, generate a fake Square customer ID
      const fakeSquareCustomerId = `fake_square_customer_${Date.now()}`;
      
      // Store Square customer ID in users table
      await supabase
        .from('users')
        .update({ 
          square_customer_id: fakeSquareCustomerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      console.log('Created fake Square customer ID:', fakeSquareCustomerId);
      return fakeSquareCustomerId;
    }
  } catch (error) {
    console.error('Error managing Square customer:', error);
    throw error;
  }
}

/**
 * Retrieves a Square customer by ID
 * @param customerId The Square customer ID
 * @returns The Square customer object
 */
export async function getSquareCustomer(customerId: string): Promise<any> {
  // In a real implementation, we would retrieve the customer from Square
  // For now, return a fake customer object
  return {
    id: customerId,
    givenName: 'Test',
    familyName: 'Customer',
    emailAddress: 'test@example.com',
    createdAt: new Date().toISOString()
  };
}
