import { supabase } from './supabase';

/**
 * Creates or updates a Square customer record and links it to a Supabase user
 * @param user The Supabase user object
 * @returns The Square customer ID
 */
export async function createOrUpdateSquareCustomer(user: any): Promise<string> {
  try {
    // Check if user already has a Square customer ID in their user record
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')  // Select all columns to avoid type errors with missing columns
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
    
    // Check if square_customer_id exists and has a value
    if (userData && 'square_customer_id' in userData && userData.square_customer_id) {
      console.log('Using existing Square customer ID:', userData.square_customer_id);
      
      try {
        // Update the customer in Square to ensure data is current
        const accessToken = process.env.SQUARE_ACCESS_TOKEN;
        const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
        const baseUrl = environment === 'production' 
          ? 'https://connect.squareup.com' 
          : 'https://connect.squareupsandbox.com';
        
        // Format phone number if it exists
        let formattedPhone = userData.mobile_number || '';
        if (formattedPhone) {
          // Remove any non-digit characters
          let digits = formattedPhone.replace(/\D/g, '');
          
          // Australian mobile numbers are 10 digits starting with 04
          if (digits.startsWith('0') && digits.length === 10) {
            // Remove the leading 0 and add +61 prefix
            digits = digits.substring(1);
            formattedPhone = '+61' + digits;
          } 
          // If it starts with 61, make sure it has a + prefix
          else if (digits.startsWith('61') && digits.length === 11) {
            formattedPhone = '+' + digits;
          }
          // If it's 9 digits and starts with 4, it's likely an Australian mobile without the leading 0
          else if (digits.length === 9 && digits.startsWith('4')) {
            formattedPhone = '+61' + digits;
          }
          // For any other format, don't include it
          else {
            formattedPhone = '';
          }
        }
        
        const updateResponse = await fetch(`${baseUrl}/v2/customers/${userData.square_customer_id}`, {
          method: 'PUT',
          headers: {
            'Square-Version': '2024-05-04',
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          email_address: user.email,
          given_name: userData.first_name || user.name?.split(' ')[0] || '',
          family_name: userData.last_name || (user.name && user.name.includes(' ') ? user.name?.split(' ').slice(1).join(' ') : ''),
          ...(formattedPhone ? { phone_number: formattedPhone } : {})
        })
        });
        
        const updateData = await updateResponse.json();
        
        if (!updateResponse.ok) {
          // If the customer doesn't exist in Square anymore, create a new one
          if (updateResponse.status === 404) {
            console.log('Customer not found in Square, creating new one');
            return await createNewSquareCustomer(user, userData);
          }
          
          console.error('Error updating Square customer:', updateData?.errors?.[0]?.detail || 'Unknown error');
          // Continue with existing ID even if update fails
        } else {
          console.log('Updated Square customer:', updateData.customer?.id);
        }
      } catch (updateError: any) {
        console.error('Error updating Square customer:', updateError);
        // Continue with existing ID even if update fails
      }
      
      return userData.square_customer_id as string;
    } else {
      // Create a new customer in Square
      return await createNewSquareCustomer(user, userData);
    }
  } catch (error: any) {
    console.error('Error managing Square customer:', error);
    throw new Error(`Failed to manage Square customer: ${error.message}`);
  }
}

/**
 * Creates a new Square customer and updates the user record
 * @param user The Supabase user object
 * @param userData The user data from Supabase
 * @returns The Square customer ID
 */
async function createNewSquareCustomer(user: any, userData: any): Promise<string> {
  try {
    // Create customer in Square
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
    const baseUrl = environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';
    
    // Format phone number if it exists
    let formattedPhone = userData?.mobile_number || '';
    if (formattedPhone) {
      // Remove any non-digit characters
      let digits = formattedPhone.replace(/\D/g, '');
      
      // Australian mobile numbers are 10 digits starting with 04
      if (digits.startsWith('0') && digits.length === 10) {
        // Remove the leading 0 and add +61 prefix
        digits = digits.substring(1);
        formattedPhone = '+61' + digits;
      } 
      // If it starts with 61, make sure it has a + prefix
      else if (digits.startsWith('61') && digits.length === 11) {
        formattedPhone = '+' + digits;
      }
      // If it's 9 digits and starts with 4, it's likely an Australian mobile without the leading 0
      else if (digits.length === 9 && digits.startsWith('4')) {
        formattedPhone = '+61' + digits;
      }
      // For any other format, don't include it
      else {
        formattedPhone = '';
      }
    }
    
    const createResponse = await fetch(`${baseUrl}/v2/customers`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-05-04',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: user.email,
        given_name: userData?.first_name || user.name?.split(' ')[0] || '',
        family_name: userData?.last_name || (user.name && user.name.includes(' ') ? user.name?.split(' ').slice(1).join(' ') : ''),
        ...(formattedPhone ? { phone_number: formattedPhone } : {}),
        reference_id: user.id.toString() // Link to our user ID
      })
    });
    
    const createData = await createResponse.json();
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create Square customer: ${createData?.errors?.[0]?.detail || 'Unknown error'}`);
    }
    
    if (!createData.customer?.id) {
      throw new Error('Failed to create Square customer: No customer ID returned');
    }
    
    const squareCustomerId = createData.customer.id;
    console.log('Created new Square customer:', squareCustomerId);
    
    // Store Square customer ID in users table
    try {
      await supabase
        .from('users')
        .update({ 
          updated_at: new Date().toISOString(),
          square_customer_id: squareCustomerId
        })
        .eq('id', user.id);
    } catch (updateError) {
      console.error('Error updating user with Square customer ID:', updateError);
      // Continue anyway since we're returning the ID
    }
    
    return squareCustomerId;
  } catch (error: any) {
    console.error('Error creating Square customer:', error);
    throw new Error(`Failed to create Square customer: ${error.message}`);
  }
}

/**
 * Retrieves a Square customer by ID
 * @param customerId The Square customer ID
 * @returns The Square customer object
 */
export async function getSquareCustomer(customerId: string): Promise<any> {
  try {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
    const baseUrl = environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';
    
    const response = await fetch(`${baseUrl}/v2/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Square-Version': '2024-05-04',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve Square customer: ${data?.errors?.[0]?.detail || 'Unknown error'}`);
    }
    
    return data.customer;
  } catch (error: any) {
    console.error('Error retrieving Square customer:', error);
    throw new Error(`Failed to retrieve Square customer: ${error.message}`);
  }
}
