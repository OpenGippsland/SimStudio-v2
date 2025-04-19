import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // If email is provided, get specific user
      if (req.query.email) {
        const { email } = req.query
        if (typeof email !== 'string') {
          return res.status(400).json({ error: 'Email query parameter must be a string' })
        }

        // Get user with credits
        const { data: users, error } = await supabase
          .from('users')
          .select(`
            id, 
            email, 
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
        const formattedUsers = users.map(user => ({
          id: user.id,
          email: user.email,
          simulator_hours: user.credits?.simulator_hours || 0
        }));
        
        return res.status(200).json(formattedUsers)
      } 
      // Otherwise, get all users
      else {
        // Get all users with credits
        const { data: users, error } = await supabase
          .from('users')
          .select(`
            id, 
            email, 
            credits (
              simulator_hours
            )
          `);
        
        if (error) {
          throw error;
        }
        
        // Format the response to match the expected structure
        const formattedUsers = users.map(user => ({
          id: user.id,
          email: user.email,
          simulator_hours: user.credits?.simulator_hours || 0
        }));
        
        return res.status(200).json(formattedUsers)
      }
    }
    else if (req.method === 'POST') {
      const { email, firstName } = req.body
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

      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert({ email })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return res.status(201).json({ id: data.id })
    }
    else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Users API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
