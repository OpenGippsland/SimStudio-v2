import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { getUserByEmail, createUser } from '../../lib/db-supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // For simplicity in this demo, we'll skip the authentication check
  // In a real application, you would verify the user's session here
  
  // Get email from the request body or query
  const email = req.method === 'PUT' ? req.body.email : req.query.email;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  // Use the email as the identifier
  const authUser = { email };
  
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
        });
      }
      
      // Update user in NextAuth
      const { firstName, lastName, email, mobileNumber } = req.body;
      
      if (firstName || lastName) {
        // Construct the full name
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        
        console.log(`Updating user name to: ${fullName}`);
        
        try {
          // Use regular supabase client for database operations
          const { data: updatedUser, error } = await supabase
            .from('users')
            .update({ 
              name: fullName,
              first_name: firstName || null,
              last_name: lastName || null,
              mobile_number: mobileNumber,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single();
          
          if (error) {
            console.error('Error updating user name:', error);
            return res.status(500).json({ error: 'Failed to update user name in database' });
          }
          
          // Log the updated user for debugging
          console.log('Updated user in database:', updatedUser);
          
          // Also update the NextAuth session user
          // This is handled by the refreshUser function in AuthContext
          
          // Return the updated user
          return res.status(200).json(updatedUser);
        } catch (updateError) {
          console.error('Exception updating user name:', updateError);
          return res.status(500).json({ error: 'Exception occurred while updating user name' });
        }
      }
      
      return res.status(200).json(user);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: error.message || 'Failed to update profile' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
