import { supabase } from '../supabase';

export async function addUserRoles() {
  console.log('Adding name, is_coach, and is_admin columns to users table...');
  
  // Check if columns already exist
  const { data: columns, error: checkError } = await supabase
    .from('users')
    .select('name')
    .limit(1)
    .catch(() => ({ data: null, error: { message: 'Column does not exist' } }));
  
  if (columns) {
    console.log('Columns already exist, skipping migration');
    return;
  }
  
  // Add name column
  const { error: nameError } = await supabase.rpc('create_user_roles_columns');
  
  if (nameError) {
    console.error('Error adding columns:', nameError);
    throw nameError;
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
