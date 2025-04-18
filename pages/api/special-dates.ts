import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

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

      const stmt = db.prepare(`
        INSERT INTO special_dates (date, is_closed, open_hour, close_hour, description)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
        is_closed = excluded.is_closed,
        open_hour = excluded.open_hour,
        close_hour = excluded.close_hour,
        description = excluded.description
      `)

      const result = stmt.run(
        date,
        isClosed ? 1 : 0,
        openHour !== undefined ? openHour : null,
        closeHour !== undefined ? closeHour : null,
        description || null
      )
      return res.status(201).json({ id: result.lastInsertRowid })
    }
    else if (req.method === 'GET') {
      const { date, from, to } = req.query
      
      let specialDates;
      if (date) {
        // Get specific date
        specialDates = db.prepare(`
          SELECT * FROM special_dates WHERE date = ?
        `).get(date)
      } else if (from && to) {
        // Get date range
        specialDates = db.prepare(`
          SELECT * FROM special_dates 
          WHERE date >= ? AND date <= ?
          ORDER BY date
        `).all(from, to)
      } else {
        // Get all dates
        specialDates = db.prepare(`
          SELECT * FROM special_dates ORDER BY date
        `).all()
      }
      
      return res.status(200).json(specialDates || [])
    }
    else if (req.method === 'DELETE') {
      const { date } = req.query
      
      if (!date) {
        return res.status(400).json({ error: 'Date is required' })
      }
      
      const result = db.prepare(`
        DELETE FROM special_dates WHERE date = ?
      `).run(date)
      
      if (result.changes === 0) {
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
