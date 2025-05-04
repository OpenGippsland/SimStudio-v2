import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createCoachProfilesRpcFunction, createCoachProfilesTable } from '../../../lib/migrations/add-coach-profiles';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(req, res, authOptions);
    
    // Get user from Supabase to check admin status
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    
    // Check if user is an admin using the auth-utils helper
    const { supabase } = await import('../../../lib/supabase');
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();
    
    if (!userData?.is_admin) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }
    
    // Get the SQL for creating the function
    const createFunctionSQL = await createCoachProfilesRpcFunction();
    
    // Execute the SQL using Supabase MCP
    const { default: fetch } = await import('node-fetch');
    
    // Create the function first
    const functionResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || ''}`
      },
      body: JSON.stringify({ sql: createFunctionSQL })
    });
    
    if (!functionResponse.ok) {
      const errorData = await functionResponse.json();
      throw new Error(`Function creation failed: ${JSON.stringify(errorData)}`);
    }
    
    // Execute the function to create the table
    const tableResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || ''}`
      },
      body: JSON.stringify({ sql: 'SELECT create_coach_profiles_table()' })
    });
    
    if (!tableResponse.ok) {
      const errorData = await tableResponse.json();
      throw new Error(`Table creation failed: ${JSON.stringify(errorData)}`);
    }
    
    // Create initial coach profiles
    const result = await createCoachProfilesTable();
    
    return res.status(200).json({
      success: true,
      message: 'Coach profiles migration completed successfully',
      result
    });
  } catch (error: any) {
    console.error('Error running coach profiles migration:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during migration'
    });
  }
}
