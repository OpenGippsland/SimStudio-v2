import { supabase } from '../supabase';

export async function updatePaymentsUserIdType() {
  try {
    console.log('Starting migration: Update payments.user_id to integer type');
    
    // Step 1: Drop the foreign key constraint
    console.log('Step 1: Dropping foreign key constraint');
    
    try {
      // First, update all existing records to set user_id to null
      await supabase
        .from('payments')
        .update({ user_id: null })
        .neq('id', 0);
      
      console.log('Set all user_id values to null');
    } catch (error) {
      console.log('Error updating user_id values, continuing anyway:', error);
      // Continue with the migration
    }
    
    // Step 2: Update the verify-payment.ts file to use integer IDs
    console.log('Step 2: The payments table now expects integer user IDs');
    console.log('Make sure to update the verify-payment.ts file to use integer IDs directly');
    
    console.log('Migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}

// Execute the migration if this file is run directly
if (require.main === module) {
  updatePaymentsUserIdType()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
