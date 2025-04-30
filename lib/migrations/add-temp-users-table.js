const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// This script creates the temp_users table in Supabase
// It should be run once to set up the table

console.log('Creating temp_users table...');

// Create a SQL script that can be run in the Supabase SQL editor
console.log(`
-- Run this SQL in the Supabase SQL Editor to create the temp_users table

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

console.log('\nPlease copy the SQL above and run it in the Supabase SQL Editor.');
console.log('Alternatively, you can use the Supabase dashboard to create the table manually.');
console.log('\nTable structure:');
console.log('- id: SERIAL PRIMARY KEY');
console.log('- reference_id: UUID NOT NULL UNIQUE');
console.log('- email: TEXT NOT NULL');
console.log('- first_name: TEXT');
console.log('- created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
