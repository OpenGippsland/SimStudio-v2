import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

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

      const stmt = db.prepare(`
        INSERT INTO business_hours (day_of_week, open_hour, close_hour, is_closed)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(day_of_week) DO UPDATE SET
        open_hour = excluded.open_hour,
        close_hour = excluded.close_hour,
        is_closed = excluded.is_closed
      `)

      const result = stmt.run(dayOfWeek, openHour, closeHour, isClosed ? 1 : 0)
      return res.status(201).json({ id: result.lastInsertRowid })
    }
    else if (req.method === 'GET') {
      const { dayOfWeek } = req.query
      
      let businessHours;
      if (dayOfWeek !== undefined) {
        // Get specific day
        businessHours = db.prepare(`
          SELECT * FROM business_hours WHERE day_of_week = ?
        `).get(Number(dayOfWeek))
      } else {
        // Get all days
        businessHours = db.prepare(`
          SELECT * FROM business_hours ORDER BY day_of_week
        `).all()
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
