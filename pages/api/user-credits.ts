import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

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
      const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      // Get user credits
      const credits = db.prepare(`
        SELECT user_id, simulator_hours, coaching_sessions 
        FROM credits 
        WHERE user_id = ?
      `).get(userId) || { user_id: userId, simulator_hours: 0, coaching_sessions: 0 }
      
      return res.status(200).json(credits)
    }
    
    // POST - Add credits to a user (e.g., when purchasing a package)
    else if (req.method === 'POST') {
      const { userId, packageId, hours } = req.body
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }
      
      // Check if user exists
      const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      let creditsToAdd = 0;
      
      // If packageId is provided, get hours from package
      if (packageId) {
        // Check if package exists
        interface Package {
          id: number;
          hours: number;
        }
        
        const package_ = db.prepare('SELECT id, hours FROM packages WHERE id = ? AND is_active = 1').get(packageId) as Package | undefined
        if (!package_) {
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
      
      // Begin transaction
      db.prepare('BEGIN TRANSACTION').run()
      
      try {
        // Get current credits
        const currentCredits = db.prepare('SELECT simulator_hours FROM credits WHERE user_id = ?').get(userId)
        
        if (currentCredits) {
          // Update existing credits
          db.prepare(`
            UPDATE credits 
            SET simulator_hours = simulator_hours + ? 
            WHERE user_id = ?
          `).run(creditsToAdd, userId)
        } else {
          // Insert new credits record
          db.prepare(`
            INSERT INTO credits (user_id, simulator_hours) 
            VALUES (?, ?)
          `).run(userId, creditsToAdd)
        }
        
        // Commit transaction
        db.prepare('COMMIT').run()
        
        // Get updated credits
        const updatedCredits = db.prepare(`
          SELECT user_id, simulator_hours, coaching_sessions 
          FROM credits 
          WHERE user_id = ?
        `).get(userId)
        
        return res.status(200).json({
          message: 'Credits added successfully',
          credits: updatedCredits
        })
      } catch (error) {
        // Rollback transaction on error
        db.prepare('ROLLBACK').run()
        throw error
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
      const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      // Begin transaction
      db.prepare('BEGIN TRANSACTION').run()
      
      try {
        // Check if credits record exists
        const existingCredits = db.prepare('SELECT user_id FROM credits WHERE user_id = ?').get(userId)
        
        if (existingCredits) {
          // Build update query based on provided fields
          let updateFields = []
          let params = []
          
          if (simulator_hours !== undefined) {
            updateFields.push('simulator_hours = ?')
            params.push(simulator_hours)
          }
          
          if (coaching_sessions !== undefined) {
            updateFields.push('coaching_sessions = ?')
            params.push(coaching_sessions)
          }
          
          // Add userId to params
          params.push(userId)
          
          // Update existing credits
          db.prepare(`
            UPDATE credits 
            SET ${updateFields.join(', ')} 
            WHERE user_id = ?
          `).run(...params)
        } else {
          // Insert new credits record
          db.prepare(`
            INSERT INTO credits (user_id, simulator_hours, coaching_sessions) 
            VALUES (?, ?, ?)
          `).run(
            userId, 
            simulator_hours !== undefined ? simulator_hours : 0,
            coaching_sessions !== undefined ? coaching_sessions : 0
          )
        }
        
        // Commit transaction
        db.prepare('COMMIT').run()
        
        // Get updated credits
        const updatedCredits = db.prepare(`
          SELECT user_id, simulator_hours, coaching_sessions 
          FROM credits 
          WHERE user_id = ?
        `).get(userId)
        
        return res.status(200).json({
          message: 'Credits updated successfully',
          credits: updatedCredits
        })
      } catch (error) {
        // Rollback transaction on error
        db.prepare('ROLLBACK').run()
        throw error
      }
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
