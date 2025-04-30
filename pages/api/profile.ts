import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { getUserByEmail, createUser } from '../../lib/db-supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user from session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const authUser = session.user;
  
  if (req.method === 'GET') {
    try {
      // Get user from our database
      const user = await getUserByEmail(authUser.email || '');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch profile' });
    }
  } 
  else if (req.method === 'PUT') {
    try {
      // Get user from our database
      let user = await getUserByEmail(authUser.email || '');
      
      if (!user) {
        // Create user if not exists
        user = await createUser({ 
          email: authUser.email || '',
          // Add any other fields from req.body as needed
        });
      }
      
      // Update user in our database
      // This would need to be implemented in db-supabase.ts
      // For now, we'll just return the user
      
      return res.status(200).json(user);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: error.message || 'Failed to update profile' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
