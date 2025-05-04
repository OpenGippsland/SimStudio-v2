import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

// Define extended user type with optional fields
interface ExtendedUser {
  id: number;
  email: string;
  name?: string;
  is_coach?: boolean;
  is_admin?: boolean;
  credits?: {
    simulator_hours: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - Fetch users
    if (req.method === 'GET') {
      // If email is provided, get specific user
      if (req.query.email) {
        const { email } = req.query
        if (typeof email !== 'string') {
          return res.status(400).json({ error: 'Email query parameter must be a string' })
        }

        // Get user with credits and role fields
        const { data: users, error } = await supabase
          .from('users')
          .select(`
            id, 
            email,
            name,
            is_coach,
            is_admin,
            credits (
              simulator_hours
            )
          `)
          .eq('email', email)
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        if (!users || users.length === 0) {
          return res.status(404).json({ error: 'User not found' })
        }
        
        // Format the response to match the expected structure
        const formattedUsers = users.map(user => {
          const extendedUser = user as unknown as ExtendedUser;
          return {
            id: extendedUser.id,
            email: extendedUser.email,
            name: extendedUser.name || '',
            is_coach: extendedUser.is_coach || false,
            is_admin: extendedUser.is_admin || false,
            simulator_hours: extendedUser.credits?.simulator_hours || 0
          };
        });
        
        return res.status(200).json(formattedUsers)
      } 
      // If ID is provided, get specific user
      else if (req.query.id) {
        const { id } = req.query
        if (typeof id !== 'string') {
          return res.status(400).json({ error: 'ID query parameter must be a string' })
        }

        // Get user with credits and role fields
        const { data: user, error } = await supabase
          .from('users')
          .select(`
            id, 
            email,
            name,
            is_coach,
            is_admin,
            credits (
              simulator_hours
            )
          `)
          .eq('id', parseInt(id))
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            return res.status(404).json({ error: 'User not found' })
          }
          throw error;
        }
        
        // Format the response
        const extendedUser = user as unknown as ExtendedUser;
        const formattedUser = {
          id: extendedUser.id,
          email: extendedUser.email,
          name: extendedUser.name || '',
          is_coach: extendedUser.is_coach || false,
          is_admin: extendedUser.is_admin || false,
          simulator_hours: extendedUser.credits?.simulator_hours || 0
        };
        
        return res.status(200).json(formattedUser)
      }
      // Get potential coaches (users who don't have a coach profile yet)
      else if (req.query.role === 'potential_coaches') {
        // First, get all users
        const { data: allUsers, error: usersError } = await supabase
          .from('users')
          .select(`
            id, 
            email,
            name,
            is_coach,
            is_admin
          `)
          .order('name');
        
        if (usersError) {
          throw usersError;
        }
        
        // Then, get all existing coach profiles
        const { data: coachProfiles, error: profilesError } = await supabase
          .from('coach_profiles')
          .select('user_id');
        
        if (profilesError) {
          throw profilesError;
        }
        
        // Filter out users who already have a coach profile
        const existingProfileUserIds = coachProfiles.map(profile => profile.user_id);
        const potentialCoaches = allUsers.filter(user => !existingProfileUserIds.includes(user.id));
        
        return res.status(200).json(potentialCoaches);
      }
      // Otherwise, get all users
      else {
        // Get all users with credits and role fields
        const { data: users, error } = await supabase
          .from('users')
          .select(`
            id, 
            email,
            name,
            is_coach,
            is_admin,
            credits (
              simulator_hours
            )
          `);
        
        if (error) {
          throw error;
        }
        
        // Format the response to match the expected structure
        const formattedUsers = users.map(user => {
          const extendedUser = user as unknown as ExtendedUser;
          return {
            id: extendedUser.id,
            email: extendedUser.email,
            name: extendedUser.name || '',
            is_coach: extendedUser.is_coach || false,
            is_admin: extendedUser.is_admin || false,
            simulator_hours: extendedUser.credits?.simulator_hours || 0
          };
        });
        
        return res.status(200).json(formattedUsers)
      }
    }
    // POST - Create a new user
    else if (req.method === 'POST') {
      const { email, firstName, lastName } = req.body
      if (!email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      // Check if user exists first
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1)
        .single();
      
      if (existingUser) {
        return res.status(200).json({ id: existingUser.id, message: 'User already exists' })
      }

      // Construct name if firstName and/or lastName are provided
      let name = null;
      if (firstName || lastName) {
        name = [firstName, lastName].filter(Boolean).join(' ');
      }

      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert({ 
          email,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return res.status(201).json({ id: data.id })
    }
    // PUT - Update a user
    else if (req.method === 'PUT') {
      const { id } = req.query
      const { name, is_coach, is_admin } = req.body
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'User ID is required' })
      }

      // First check if the columns exist
      let columnsExist = true;
      try {
        await supabase
          .from('users')
          .select('name')
          .limit(1);
      } catch (error) {
        columnsExist = false;
      }

      // If columns don't exist, return a specific error
      if (!columnsExist) {
        return res.status(400).json({ 
          error: 'User columns not set up. Please run the migration first.',
          needsMigration: true
        });
      }

      // Update user
      const { data, error } = await supabase
        .from('users')
        .update({ 
          name,
          is_coach,
          is_admin,
          updated_at: new Date().toISOString()
        })
        .eq('id', parseInt(id))
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return res.status(200).json(data)
    }
    // DELETE - Delete a user
    else if (req.method === 'DELETE') {
      const { id } = req.query
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'User ID is required' })
      }

      // Start a transaction to delete related records first
      try {
        // 1. Delete related credits records
        const { error: creditsError } = await supabase
          .from('credits')
          .delete()
          .eq('user_id', parseInt(id));
        
        if (creditsError) {
          console.error('Error deleting credits:', creditsError);
          throw creditsError;
        }

        // 2. Check for and delete any coach profiles
        const { error: coachProfileError } = await supabase
          .from('coach_profiles')
          .delete()
          .eq('user_id', parseInt(id));
        
        if (coachProfileError && coachProfileError.code !== 'PGRST116') {
          console.error('Error deleting coach profile:', coachProfileError);
          throw coachProfileError;
        }

        // 3. Check for and delete any bookings
        const { error: bookingsError } = await supabase
          .from('bookings')
          .delete()
          .eq('user_id', parseInt(id));
        
        if (bookingsError && bookingsError.code !== 'PGRST116') {
          console.error('Error deleting bookings:', bookingsError);
          throw bookingsError;
        }

        // 4. Finally delete the user
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', parseInt(id));
        
        if (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
        
        return res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }
    }
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Users API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
