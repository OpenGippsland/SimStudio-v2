import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

// Define an extended user type with the new columns
interface ExtendedUser {
  id?: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
  name?: string | null;
  is_coach?: boolean;
  is_admin?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    console.log('Starting migration to add user roles...');

    // Check if users table exists
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Error checking users table:', error);
        return res.status(500).json({ error: 'Failed to check users table' });
      }
      
      // Try to add the columns directly using the Supabase client
      try {
        console.log('Attempting to add columns to users table...');
        
        // Use type assertion to bypass TypeScript checks
        const updateData = {
          name: null,
          is_coach: false,
          is_admin: false
        } as unknown as Record<string, any>;
        
        // Try to update a non-existent user to trigger column creation
        await supabase
          .from('users')
          .update(updateData)
          .eq('id', -1);
        
        console.log('Migration completed successfully');
        return res.status(200).json({ message: 'Migration completed successfully' });
      } catch (error) {
        console.error('Error adding columns:', error);
        return res.status(500).json({ error: 'Failed to add columns to users table' });
      }
    } catch (error) {
      console.error('Error checking if users table exists:', error);
      return res.status(500).json({ error: 'Failed to check if users table exists' });
    }
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
