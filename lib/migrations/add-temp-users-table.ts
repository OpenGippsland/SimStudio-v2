import { supabase } from '../supabase';

export async function addTempUsersTable() {
  // Create the temp_users table if it doesn't exist
  const { error } = await supabase.from('temp_users').select('id').limit(1).catch(() => {
    // If the table doesn't exist, create it
    return supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        throw new Error('Not authenticated');
      }
      
      // Use service role client to create table
      return supabase.from('_migrations').insert({
        name: 'add_temp_users_table',
        executed_at: new Date().toISOString(),
        hash: 'manual'
      });
    });
  });
  
  if (error) {
    console.error('Migration error:', error);
    throw error;
  }
  
  console.log('Successfully added temp_users table');
}

// Execute if this file is run directly
if (require.main === module) {
  addTempUsersTable()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
