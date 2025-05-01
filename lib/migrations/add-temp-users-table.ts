import { supabase } from '../supabase';

export async function addTempUsersTable() {
  try {
    // Check if the temp_users table exists
    const { data, error } = await supabase.from('temp_users').select('id').limit(1);
    
    // If there's an error (likely because the table doesn't exist)
    if (error) {
      console.error('Error accessing temp_users table:', error);
      console.log(`
      The temp_users table might not exist. Please run the following SQL in the Supabase SQL Editor:
      
      CREATE TABLE IF NOT EXISTS public.temp_users (
        id SERIAL PRIMARY KEY,
        reference_id UUID NOT NULL UNIQUE,
        email TEXT NOT NULL,
        first_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Add appropriate permissions
      ALTER TABLE public.temp_users ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY "Allow authenticated users to select temp_users"
        ON public.temp_users
        FOR SELECT
        TO authenticated
        USING (true);
      
      CREATE POLICY "Allow authenticated users to insert temp_users"
        ON public.temp_users
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
      
      CREATE POLICY "Allow authenticated users to update their own temp_users"
        ON public.temp_users
        FOR UPDATE
        TO authenticated
        USING (true);
      
      CREATE POLICY "Allow authenticated users to delete their own temp_users"
        ON public.temp_users
        FOR DELETE
        TO authenticated
        USING (true);
      `);
      
      throw new Error('temp_users table does not exist. Please run the SQL above in the Supabase SQL Editor.');
    }
    
    console.log('temp_users table exists');
    return true;
  } catch (error) {
    console.error('Error in addTempUsersTable:', error);
    throw error;
  }
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
