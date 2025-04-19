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
        .single();
      
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
        
        if (error) throw error;
        result = data;
      }
      
      return res.status(201).json({ id: result.id })
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
      
      return res.status(200).json(data || [])
    }
    else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Coach availability API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
