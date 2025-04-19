import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - Retrieve a user's credits
    if (req.method === 'GET') {
      const { userId } = req.query
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }
      
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', typeof userId === 'string' ? parseInt(userId, 10) : parseInt(userId[0], 10))
        .single();
      
      if (userError || !user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      // Get user credits
      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .select('user_id, simulator_hours, coaching_sessions')
        .eq('user_id', user.id)
        .single();
      
      if (creditsError && creditsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw creditsError;
      }
      
      // If no credits record exists, return default values
      const creditsData = credits || { 
        user_id: user.id, 
        simulator_hours: 0, 
        coaching_sessions: 0 
      };
      
      return res.status(200).json(creditsData)
    }
    
    // POST - Add credits to a user (e.g., when purchasing a package)
    else if (req.method === 'POST') {
      const { userId, packageId, hours } = req.body
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }
      
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (userError || !user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      let creditsToAdd = 0;
      
      // If packageId is provided, get hours from package
      if (packageId) {
        // Check if package exists
        const { data: package_, error: packageError } = await supabase
          .from('packages')
          .select('id, hours')
          .eq('id', packageId)
          .eq('is_active', true)
          .single();
        
        if (packageError || !package_) {
          return res.status(404).json({ error: 'Package not found or inactive' })
        }
        
        creditsToAdd = package_.hours;
      } 
      // If hours are provided directly, use those
      else if (hours) {
        creditsToAdd = Number(hours);
        if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
          return res.status(400).json({ error: 'Hours must be a positive number' })
        }
      }
      else {
        return res.status(400).json({ error: 'Either Package ID or Hours are required' })
      }
      
      // Get current credits
      const { data: currentCredits, error: creditsError } = await supabase
        .from('credits')
        .select('simulator_hours')
        .eq('user_id', userId)
        .single();
      
      if (currentCredits) {
        // Update existing credits
        const { data: updatedCredits, error: updateError } = await supabase
          .from('credits')
          .update({ 
            simulator_hours: currentCredits.simulator_hours + creditsToAdd 
          })
          .eq('user_id', userId)
          .select()
          .single();
        
        if (updateError) {
          throw updateError;
        }
        
        return res.status(200).json({
          message: 'Credits added successfully',
          credits: updatedCredits
        });
      } else {
        // Insert new credits record
        const { data: newCredits, error: insertError } = await supabase
          .from('credits')
          .insert({ 
            user_id: userId, 
            simulator_hours: creditsToAdd 
          })
          .select()
          .single();
        
        if (insertError) {
          throw insertError;
        }
        
        return res.status(200).json({
          message: 'Credits added successfully',
          credits: newCredits
        });
      }
    }
    
    // PUT - Update a user's credits directly (admin function)
    else if (req.method === 'PUT') {
      const { userId } = req.query
      const { simulator_hours, coaching_sessions } = req.body
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }
      
      if (simulator_hours === undefined && coaching_sessions === undefined) {
        return res.status(400).json({ error: 'At least one credit type must be provided' })
      }
      
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', typeof userId === 'string' ? parseInt(userId, 10) : parseInt(userId[0], 10))
        .single();
      
      if (userError || !user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      // Build update object
      const updateData: { simulator_hours?: number, coaching_sessions?: number } = {};
      
      if (simulator_hours !== undefined) {
        updateData.simulator_hours = simulator_hours;
      }
      
      if (coaching_sessions !== undefined) {
        updateData.coaching_sessions = coaching_sessions;
      }
      
      // Check if credits record exists
      const { data: existingCredits, error: checkError } = await supabase
        .from('credits')
        .select('user_id')
        .eq('user_id', user.id)
        .single();
      
      let updatedCredits;
      
      if (existingCredits) {
        // Update existing credits
        const { data, error: updateError } = await supabase
          .from('credits')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (updateError) {
          throw updateError;
        }
        
        updatedCredits = data;
      } else {
        // Insert new credits record
        const { data, error: insertError } = await supabase
          .from('credits')
          .insert({ 
            user_id: user.id, 
            simulator_hours: simulator_hours !== undefined ? simulator_hours : 0,
            coaching_sessions: coaching_sessions !== undefined ? coaching_sessions : 0
          })
          .select()
          .single();
        
        if (insertError) {
          throw insertError;
        }
        
        updatedCredits = data;
      }
      
      return res.status(200).json({
        message: 'Credits updated successfully',
        credits: updatedCredits
      });
    }
    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('User Credits API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
