import { supabase } from '../supabase';

export async function addPaymentsTable() {
  console.log('Creating payments table...');
  
  // Create the payments table
  const { error: createTableError } = await supabase.rpc('create_payments_table');
  
  if (createTableError) {
    console.error('Error creating payments table:', createTableError);
    throw createTableError;
  }
  
  console.log('Payments table created successfully');
  return { success: true };
}

// Execute the migration if this file is run directly
if (require.main === module) {
  addPaymentsTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
