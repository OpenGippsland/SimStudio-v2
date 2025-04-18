import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

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

      const stmt = db.prepare(`
        INSERT INTO coach_availability (coach_id, day_of_week, start_hour, end_hour)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(coach_id, day_of_week, start_hour) DO UPDATE SET
        end_hour = excluded.end_hour
      `)

      const result = stmt.run(coachId, dayOfWeek, startHour, endHour)
      return res.status(201).json({ id: result.lastInsertRowid })
    }
    else if (req.method === 'GET') {
      const { coachId } = req.query
      const availability = db.prepare(`
        SELECT * FROM coach_availability 
        ${coachId ? 'WHERE coach_id = ?' : ''}
        ORDER BY coach_id, day_of_week, start_hour
      `).all(coachId ? [coachId] : [])
      
      return res.status(200).json(availability)
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
