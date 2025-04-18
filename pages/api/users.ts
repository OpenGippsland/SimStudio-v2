import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

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

        // Check if first_name column exists in users table
        interface TableColumn {
          name: string;
          [key: string]: any;
        }
        
        const tableInfo = db.prepare("PRAGMA table_info(users)").all() as TableColumn[];
        const hasFirstName = tableInfo.some(column => column.name === 'first_name');
        
        let user;
        if (hasFirstName) {
          user = db.prepare(`
            SELECT u.id, u.email, u.first_name, COALESCE(c.simulator_hours, 0) as simulator_hours 
            FROM users u
            LEFT JOIN credits c ON u.id = c.user_id
            WHERE u.email = ?
          `).get(email) as { id: number, email: string, first_name: string, simulator_hours: number } | undefined
        } else {
          user = db.prepare(`
            SELECT u.id, u.email, COALESCE(c.simulator_hours, 0) as simulator_hours 
            FROM users u
            LEFT JOIN credits c ON u.id = c.user_id
            WHERE u.email = ?
          `).get(email) as { id: number, email: string, simulator_hours: number } | undefined
        }
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' })
        }
        return res.status(200).json([user])
      } 
      // Otherwise, get all users
      else {
        // Check if first_name column exists in users table
        interface TableColumn {
          name: string;
          [key: string]: any;
        }
        
        const tableInfo = db.prepare("PRAGMA table_info(users)").all() as TableColumn[];
        const hasFirstName = tableInfo.some(column => column.name === 'first_name');
        
        let users;
        if (hasFirstName) {
          users = db.prepare(`
            SELECT u.id, u.email, u.first_name, COALESCE(c.simulator_hours, 0) as simulator_hours 
            FROM users u
            LEFT JOIN credits c ON u.id = c.user_id
          `).all() as { id: number, email: string, first_name: string, simulator_hours: number }[]
        } else {
          users = db.prepare(`
            SELECT u.id, u.email, COALESCE(c.simulator_hours, 0) as simulator_hours 
            FROM users u
            LEFT JOIN credits c ON u.id = c.user_id
          `).all() as { id: number, email: string, simulator_hours: number }[]
        }
        
        return res.status(200).json(users)
      }
    }
    else if (req.method === 'POST') {
      const { email, firstName } = req.body
      if (!email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      // Check if user exists first
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined
      if (existingUser?.id) {
        return res.status(200).json({ id: existingUser.id, message: 'User already exists' })
      }

      // Check if we have first_name column in users table
      try {
        // Try to insert with first_name
        const stmt = db.prepare('INSERT INTO users (email, first_name) VALUES (?, ?)')
        const result = stmt.run(email, firstName || null)
        return res.status(201).json({ id: result.lastInsertRowid })
      } catch (error) {
        // If error occurs (likely because first_name column doesn't exist), fall back to original method
        const stmt = db.prepare('INSERT INTO users (email) VALUES (?)')
        const result = stmt.run(email)
        return res.status(201).json({ id: result.lastInsertRowid })
      }
    }
    else {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Users API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
