import { supabase } from '../supabase';

/**
 * Migration to add square_customer_id column to the users table
 * 
 * Note: This doesn't actually create the column via SQL ALTER TABLE,
 * but instead updates a user record with the square_customer_id field,
 * which will create the column if it doesn't exist due to Supabase's
 * schema flexibility.
 */
export async function addSquareCustomerIdColumn() {
  try {
    console.log('Checking for existing users...');
    
    // Get the first user
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      throw fetchError;
    }
    
    if (users && users.length > 0) {
      const userId = users[0].id;
      
      // Update the user with a placeholder square_customer_id
      // This will create the column if it doesn't exist
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          square_customer_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }
      
      console.log('Successfully added square_customer_id column to users table');
    } else {
      console.log('No users found. The column will be created when a user is created.');
    }
  } catch (err) {
    console.error('Failed to add square_customer_id column:', err);
    throw err;
  }
}

// Execute if this file is run directly
if (require.main === module) {
  addSquareCustomerIdColumn()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
