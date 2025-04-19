import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const { date, isClosed, openHour, closeHour, description } = req.body
      
      // Validate input
      if (!date) {
        return res.status(400).json({ error: 'Date is required' })
      }
      
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: 'Invalid date format (YYYY-MM-DD)' })
      }
      
      // Validate hours if provided
      if (openHour !== undefined && openHour !== null && (openHour < 0 || openHour > 23)) {
        return res.status(400).json({ error: 'Invalid open hour (0-23)' })
      }
      if (closeHour !== undefined && closeHour !== null && (closeHour < 0 || closeHour > 23)) {
        return res.status(400).json({ error: 'Invalid close hour (0-23)' })
      }
      
      // Only validate the relationship between open and close hours if both are provided and not null
      if (openHour !== undefined && openHour !== null && 
          closeHour !== undefined && closeHour !== null && 
          openHour >= closeHour) {
        return res.status(400).json({ error: 'Open hour must be before close hour' })
      }
      
      // If not closed, ensure both hours are provided or both are null
      if (!isClosed) {
        if ((openHour === null && closeHour !== null) || 
            (openHour !== null && closeHour === null)) {
          return res.status(400).json({ error: 'Both open and close hours must be provided or both must be null' })
        }
      }

      // Check if record exists for this date
      const { data: existingRecord, error: checkError } = await supabase
        .from('special_dates')
        .select('id')
        .eq('date', date)
        .single();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        const { data, error } = await supabase
          .from('special_dates')
          .update({
            is_closed: isClosed || false,
            open_hour: openHour !== undefined ? openHour : null,
            close_hour: closeHour !== undefined ? closeHour : null,
            description: description || null
          })
          .eq('date', date)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('special_dates')
          .insert({
            date,
            is_closed: isClosed || false,
            open_hour: openHour !== undefined ? openHour : null,
            close_hour: closeHour !== undefined ? closeHour : null,
            description: description || null
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      return res.status(201).json({ id: result.id })
    }
    else if (req.method === 'GET') {
      const { date, from, to } = req.query
      
      let specialDates;
      if (date) {
        // Get specific date
        const { data, error } = await supabase
          .from('special_dates')
          .select('*')
          .eq('date', date)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        specialDates = data || null;
      } else if (from && to) {
        // Get date range
        const { data, error } = await supabase
          .from('special_dates')
          .select('*')
          .gte('date', from)
          .lte('date', to)
          .order('date');
        
        if (error) throw error;
        specialDates = data || [];
      } else {
        // Get all dates
        const { data, error } = await supabase
          .from('special_dates')
          .select('*')
          .order('date');
        
        if (error) throw error;
        specialDates = data || [];
      }
      
      return res.status(200).json(specialDates || [])
    }
    else if (req.method === 'DELETE') {
      const { date } = req.query
      
      if (!date) {
        return res.status(400).json({ error: 'Date is required' })
      }
      
      const { error, count } = await supabase
        .from('special_dates')
        .delete()
        .eq('date', date)
        .select('count');
      
      if (error) throw error;
      
      if (count === 0) {
        return res.status(404).json({ error: 'Special date not found' })
      }
      
      return res.status(200).json({ success: true })
    }
    else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Special dates API error:', error)
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
