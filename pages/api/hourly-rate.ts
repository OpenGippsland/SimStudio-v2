import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the current session to check if the user is authenticated and is an admin
  const session = await getServerSession(req, res, authOptions);
  
  // GET request to fetch the current hourly rate
  if (req.method === 'GET') {
    try {
      // Query the hourly_rate package from the database
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('name', 'hourly_rate')
        .single();
      
      if (error) {
        console.error('Error fetching hourly rate:', error);
        return res.status(500).json({ error: 'Failed to fetch hourly rate' });
      }
      
      // Return the hourly rate
      return res.status(200).json({ price: data.price });
    } catch (error) {
      console.error('Error in hourly rate GET handler:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // POST request to update the hourly rate (admin only)
  if (req.method === 'POST') {
    // Check if the user is authenticated
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    
    // Get the user ID from the session
    const userId = (session.user as any).id;
    
    // Check if the user is an admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (userError || !userData || !userData.is_admin) {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }
    
    try {
      const { value } = req.body;
      
      // Validate the input
      if (!value || isNaN(Number(value)) || Number(value) <= 0) {
        return res.status(400).json({ error: 'Invalid hourly rate value' });
      }
      
      // Update the hourly_rate package in the database
      const { data, error } = await supabase
        .from('packages')
        .update({ price: value })
        .eq('name', 'hourly_rate')
        .select()
        .single();
      
      if (error) {
        console.error('Error updating hourly rate:', error);
        return res.status(500).json({ error: 'Failed to update hourly rate' });
      }
      
      // Return the updated hourly rate
      return res.status(200).json({ price: data.price });
    } catch (error) {
      console.error('Error in hourly rate POST handler:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Return 405 Method Not Allowed for other request methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
