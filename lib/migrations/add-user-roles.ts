import { supabase } from '../supabase';

export async function addUserRoles() {
  console.log('Adding name, is_coach, and is_admin columns to users table...');
  
  // Check if columns already exist
  let columns;
  let checkError;
  
  try {
    const result = await supabase
      .from('users')
      .select('name')
      .limit(1);
    
    columns = result.data;
    checkError = result.error;
  } catch (error) {
    columns = null;
    checkError = { message: 'Column does not exist' };
  }
  
  if (columns) {
    console.log('Columns already exist, skipping migration');
    return;
  }
  
  // Execute SQL to add columns
  const { error: sqlError } = await supabase.from('users').select('id').limit(1).then(async () => {
    // Add name column
    await (supabase.rpc as any)('execute_sql', {
      sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT'
    });
    
    // Add is_coach column
    await (supabase.rpc as any)('execute_sql', {
      sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_coach BOOLEAN DEFAULT FALSE'
    });
    
    // Add is_admin column
    await (supabase.rpc as any)('execute_sql', {
      sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE'
    });
    
    return { error: null };
  });
  
  if (sqlError) {
    console.error('Error adding columns:', sqlError);
    throw sqlError;
  }
  
  console.log('Successfully added name, is_coach, and is_admin columns to users table');
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addUserRoles()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
