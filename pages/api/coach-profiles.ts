import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { supabase, supabaseAdmin } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the current user session
    const session = await getServerSession(req, res, authOptions);
    
    // Handle GET request - fetch coach profiles
    if (req.method === 'GET') {
      // Check if user_id is provided to filter by specific coach
      const { user_id } = req.query;
      
      // Build the query
      let query = supabase
        .from('coach_profiles')
        .select(`
          id,
          user_id,
          hourly_rate,
          description,
          created_at,
          updated_at,
          users:user_id (
            id,
            name,
            email
          )
        `);
      
      // Filter by user_id if provided
      if (user_id) {
        const userId = Array.isArray(user_id) ? user_id[0] : user_id;
        const userIdNum = parseInt(userId, 10);
        
        if (!isNaN(userIdNum)) {
          query = query.eq('user_id', userIdNum);
        }
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching coach profiles:', error);
        return res.status(500).json({ error: 'Failed to fetch coach profiles' });
      }
      
      return res.status(200).json(data);
    }
    
    // Handle POST request - create or update coach profile
    if (req.method === 'POST') {
      // Check if user is authenticated
      if (!session?.user?.email) {
        return res.status(401).json({ error: 'Unauthorized: Authentication required' });
      }
      
      // Get user from Supabase to check admin or coach status
      const { data: userData } = await supabase
        .from('users')
        .select('id, is_admin, is_coach')
        .eq('email', session.user.email)
        .single();
      
      // Only admins or the coach themselves can update profiles
      const { user_id, hourly_rate, description } = req.body;
      
      if (!userData?.is_admin && userData?.id !== user_id) {
        return res.status(403).json({ error: 'Unauthorized: You can only update your own profile' });
      }
      
      // Validate input
      if (!user_id) {
        return res.status(400).json({ error: 'Missing required field: user_id' });
      }
      
      if (hourly_rate !== undefined && (isNaN(hourly_rate) || hourly_rate < 0)) {
        return res.status(400).json({ error: 'Invalid hourly rate' });
      }
      
      // Start a transaction to update both the coach profile and user flag
      const { data: existingProfile } = await supabase
        .from('coach_profiles')
        .select('id')
        .eq('user_id', user_id)
        .single();
      
      // Create or update the coach profile using admin client to bypass RLS
      // Since we're in an API route, supabaseAdmin should always be available
      let data, error;
      
      if (existingProfile) {
        // If profile exists, use update instead of upsert to avoid unique constraint error
        const result = await supabaseAdmin!
          .from('coach_profiles')
          .update({
            hourly_rate: hourly_rate || 75, // Default to $75/hour if not specified
            description,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user_id)
          .select();
          
        data = result.data;
        error = result.error;
      } else {
        // If no profile exists, create a new one
        const result = await supabaseAdmin!
          .from('coach_profiles')
          .insert({
            user_id,
            hourly_rate: hourly_rate || 75, // Default to $75/hour if not specified
            description,
            updated_at: new Date().toISOString()
          })
          .select();
          
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error('Error updating coach profile:', error);
        return res.status(500).json({ error: 'Failed to update coach profile' });
      }
      
      // If this is a new profile, update the user's is_coach flag using admin client
      if (!existingProfile) {
        const { error: userUpdateError } = await supabaseAdmin!
          .from('users')
          .update({ is_coach: true })
          .eq('id', user_id);
        
        if (userUpdateError) {
          console.error('Error updating user is_coach flag:', userUpdateError);
          // We don't want to fail the whole operation if just the flag update fails
          // But we should log it
        }
      }
      
      return res.status(200).json(data[0]);
    }
    
    // Handle DELETE request - delete coach profile
    if (req.method === 'DELETE') {
      // Check if user is authenticated
      if (!session?.user?.email) {
        return res.status(401).json({ error: 'Unauthorized: Authentication required' });
      }
      
      // Get user from Supabase to check admin status
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', session.user.email)
        .single();
      
      // Only admins can delete profiles
      if (!userData?.is_admin) {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
      }
      
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Missing required parameter: id' });
      }
      
      // Delete the coach profile using admin client to bypass RLS
      const profileId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
      
      if (isNaN(profileId)) {
        return res.status(400).json({ error: 'Invalid profile ID' });
      }
      
      // First, get the user_id from the profile
      const { data: profileData, error: profileError } = await supabase
        .from('coach_profiles')
        .select('user_id')
        .eq('id', profileId)
        .single();
      
      if (profileError) {
        console.error('Error fetching coach profile:', profileError);
        return res.status(500).json({ error: 'Failed to fetch coach profile' });
      }
      
      // Delete the coach profile
      const { error } = await supabaseAdmin!
        .from('coach_profiles')
        .delete()
        .eq('id', profileId);
      
      if (error) {
        console.error('Error deleting coach profile:', error);
        return res.status(500).json({ error: 'Failed to delete coach profile' });
      }
      
      // Update the user's is_coach flag to false using admin client
      if (profileData?.user_id) {
        const { error: userUpdateError } = await supabaseAdmin!
          .from('users')
          .update({ is_coach: false })
          .eq('id', profileData.user_id);
        
        if (userUpdateError) {
          console.error('Error updating user is_coach flag:', userUpdateError);
          // We don't want to fail the whole operation if just the flag update fails
          // But we should log it
        }
      }
      
      return res.status(200).json({ success: true, message: 'Coach profile deleted successfully' });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in coach profiles API:', error);
    return res.status(500).json({ error: error.message || 'An error occurred' });
  }
}
