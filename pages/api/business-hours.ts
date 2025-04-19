import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const { dayOfWeek, openHour, closeHour, isClosed } = req.body
      
      // Validate input
      if (dayOfWeek === undefined || openHour === undefined || closeHour === undefined) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ error: 'Invalid day of week (0-6)' })
      }
      if (openHour < 0 || openHour > 23 || closeHour < 0 || closeHour > 23) {
        return res.status(400).json({ error: 'Invalid hour (0-23)' })
      }
      if (openHour >= closeHour) {
        return res.status(400).json({ error: 'Open hour must be before close hour' })
      }

      // Check if record exists for this day
      const { data: existingRecord, error: checkError } = await supabase
        .from('business_hours')
        .select('id')
        .eq('day_of_week', dayOfWeek)
        .single();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        const { data, error } = await supabase
          .from('business_hours')
          .update({
            open_hour: openHour,
            close_hour: closeHour,
            is_closed: isClosed || false
          })
          .eq('day_of_week', dayOfWeek)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('business_hours')
          .insert({
            day_of_week: dayOfWeek,
            open_hour: openHour,
            close_hour: closeHour,
            is_closed: isClosed || false
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      return res.status(201).json({ id: result.id })
    }
    else if (req.method === 'GET') {
      const { dayOfWeek } = req.query
      
      let businessHours;
      if (dayOfWeek !== undefined) {
        // Get specific day
        const { data, error } = await supabase
          .from('business_hours')
          .select('*')
          .eq('day_of_week', typeof dayOfWeek === 'string' ? parseInt(dayOfWeek, 10) : parseInt(dayOfWeek[0], 10))
          .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        businessHours = data || null;
      } else {
        // Get all days
        const { data, error } = await supabase
          .from('business_hours')
          .select('*')
          .order('day_of_week');
        
        if (error) throw error;
        businessHours = data || [];
      }
      
      return res.status(200).json(businessHours || [])
    }
    else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Business hours API error:', error)
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
