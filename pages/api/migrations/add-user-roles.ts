import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    // Check if columns already exist
    try {
      await supabase
        .from('users')
        .select('name')
        .limit(1)
        .single();
      
      // If we get here, the column exists
      return res.status(200).json({ message: 'Columns already exist, skipping migration' })
    } catch (error) {
      // Column doesn't exist, continue with migration
      console.log('Columns do not exist, proceeding with migration')
    }

    // Execute SQL to add columns
    const { error: sqlError } = await supabase.from('users').select('id').limit(1).then(async () => {
      // Add name column
      await supabase.rpc('execute_sql', {
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT'
      });
      
      // Add is_coach column
      await supabase.rpc('execute_sql', {
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_coach BOOLEAN DEFAULT FALSE'
      });
      
      // Add is_admin column
      await supabase.rpc('execute_sql', {
        sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE'
      });
      
      return { error: null };
    });

    if (sqlError) {
      throw sqlError;
    }

    return res.status(200).json({ message: 'Successfully added name, is_coach, and is_admin columns to users table' })
  } catch (error) {
    console.error('Migration error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
