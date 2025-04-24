import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const { coachId, dayOfWeek, startHour, endHour } = req.body
      
      // Validate input
      if (!coachId || dayOfWeek === undefined || startHour === undefined || endHour === undefined) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return res.status(400).json({ error: 'Invalid day of week (0-6)' })
      }
      if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
        return res.status(400).json({ error: 'Invalid hour (0-23)' })
      }

      // Check if record exists for this coach, day, and start hour
      const { data: existingRecord, error: checkError } = await supabase
        .from('coach_availability')
        .select('id')
        .eq('coach_id', coachId)
        .eq('day_of_week', dayOfWeek)
        .eq('start_hour', startHour)
        .maybeSingle();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        const { data, error } = await supabase
          .from('coach_availability')
          .update({
            end_hour: endHour
          })
          .eq('id', existingRecord.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('coach_availability')
          .insert({
            coach_id: coachId,
            day_of_week: dayOfWeek,
            start_hour: startHour,
            end_hour: endHour
          })
          .select()
          .single();
        
        if (error) {
          // If there's a duplicate key error, try again with a different approach
          if (error.code === '23505') {
            // Get the highest ID currently in the table
            const { data: maxIdData } = await supabase
              .from('coach_availability')
              .select('id')
              .order('id', { ascending: false })
              .limit(1)
              .single();
            
            const nextId = maxIdData ? maxIdData.id + 1 : 1;
            
            // Try insert with explicit ID
            const { data: retryData, error: retryError } = await supabase
              .from('coach_availability')
              .insert({
                id: nextId,
                coach_id: coachId,
                day_of_week: dayOfWeek,
                start_hour: startHour,
                end_hour: endHour
              })
              .select()
              .single();
            
            if (retryError) throw retryError;
            result = retryData;
          } else {
            throw error;
          }
        } else {
          result = data;
        }
      }
      
      return res.status(201).json({ id: result.id })
    }
    else if (req.method === 'DELETE') {
      const id = req.query.id
      
      if (!id) {
        return res.status(400).json({ error: 'Missing ID parameter' })
      }
      
      // Convert id to number (it comes as string from query params)
      const idNumber = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10)
      
      if (isNaN(idNumber)) {
        return res.status(400).json({ error: 'Invalid ID parameter' })
      }
      
      // Delete the record
      const { error } = await supabase
        .from('coach_availability')
        .delete()
        .eq('id', idNumber)
      
      if (error) throw error
      
      return res.status(200).json({ message: 'Coach availability deleted successfully' })
    }
    else if (req.method === 'GET') {
      const { coachId } = req.query
      
      let query = supabase
        .from('coach_availability')
        .select('*');
      
      if (coachId) {
        // Handle case where coachId could be a string or an array of strings
        const coachIdValue = Array.isArray(coachId) ? coachId[0] : coachId;
        query = query.eq('coach_id', coachIdValue);
      }
      
      const { data, error } = await query.order('coach_id').order('day_of_week').order('start_hour');
      if (error) throw error;

      // Check if the client wants the raw data (for admin page), grouped data (for booking system), or just the list of coaches
      const format = req.query.format as string;
      
      if (format === 'coaches') {
        // Return just the list of unique coach IDs
        const uniqueCoaches = [...new Set(data.map(item => item.coach_id))];
        return res.status(200).json(uniqueCoaches || []);
      } else if (format === 'raw') {
        // Return the raw data for the admin page
        return res.status(200).json(data || []);
      } else if (format === 'grouped') {
        // Group the data by coach_id for easier access in the booking system
        const groupedData: { [coachId: string]: any[] } = {};
        data.forEach(item => {
          if (!groupedData[item.coach_id]) {
            groupedData[item.coach_id] = [];
          }
          groupedData[item.coach_id].push(item);
        });
        
        return res.status(200).json(groupedData || {});
      } else {
        // Default to grouped format for backward compatibility
        const groupedData: { [coachId: string]: any[] } = {};
        data.forEach(item => {
          if (!groupedData[item.coach_id]) {
            groupedData[item.coach_id] = [];
          }
          groupedData[item.coach_id].push(item);
        });
        
        return res.status(200).json(groupedData || {});
      }
    }
    else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Coach availability API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
