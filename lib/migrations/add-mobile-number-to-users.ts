import { supabase } from '../supabase';

export async function addMobileNumberToUsers() {
  try {
    console.log('Starting migration: Adding mobile_number column to users table');
    
    // Check if the column already exists by trying to select it
    // If it doesn't exist, we'll get an error
    const { data: columns, error: checkError } = await supabase
      .from('users')
      .select('mobile_number')
      .limit(1);
    
    if (checkError) {
      // If the error is because the column doesn't exist, we'll add it
      if (checkError.message.includes('column "mobile_number" does not exist')) {
        // We need to use a direct SQL query to add the column
        // Since we can't use the exec_sql RPC function, we'll use the REST API
        const accessToken = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        
        // Make a direct SQL query using the REST API
        const response = await fetch(`${projectUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'apikey': accessToken
          },
          body: JSON.stringify({
            sql: `ALTER TABLE public.users ADD COLUMN mobile_number TEXT DEFAULT NULL`
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error adding mobile_number column:', errorData);
          throw new Error(`Failed to add mobile_number column: ${JSON.stringify(errorData)}`);
        }
        
        console.log('Successfully added mobile_number column to users table');
        return { success: true, message: 'mobile_number column added successfully' };
      } else {
        console.error('Error checking users table:', checkError);
        throw checkError;
      }
    }
    
    // If we got here, the column already exists
    console.log('mobile_number column already exists in users table');
    return { success: true, message: 'mobile_number column already exists' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: 'Migration failed', error };
  }
}
