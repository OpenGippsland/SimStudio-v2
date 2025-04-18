import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - Retrieve all packages or a specific package
    if (req.method === 'GET') {
      const { id } = req.query
      
      if (id) {
        // Get specific package
        const package_ = db.prepare(`
          SELECT * FROM packages WHERE id = ? AND is_active = 1
        `).get(id)
        
        if (!package_) {
          return res.status(404).json({ error: 'Package not found' })
        }
        
        return res.status(200).json(package_)
      } else {
        // Get all active packages
        const packages = db.prepare(`
          SELECT * FROM packages WHERE is_active = 1 ORDER BY hours ASC
        `).all()
        
        return res.status(200).json(packages)
      }
    }
    
    // POST - Create a new package
    else if (req.method === 'POST') {
      const { name, hours, price, description } = req.body
      
      // Validate required fields
      if (!name || !hours || !price) {
        return res.status(400).json({ error: 'Name, hours, and price are required' })
      }
      
      // Validate data types
      if (typeof name !== 'string' || typeof description !== 'string') {
        return res.status(400).json({ error: 'Name and description must be strings' })
      }
      
      if (isNaN(Number(hours)) || isNaN(Number(price))) {
        return res.status(400).json({ error: 'Hours and price must be numbers' })
      }
      
      // Insert new package
      const stmt = db.prepare(`
        INSERT INTO packages (name, hours, price, description, is_active)
        VALUES (?, ?, ?, ?, 1)
      `)
      
      const result = stmt.run(name, hours, price, description)
      return res.status(201).json({ id: result.lastInsertRowid })
    }
    
    // PUT - Update an existing package
    else if (req.method === 'PUT') {
      const { id } = req.query
      const { name, hours, price, description, is_active } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'Package ID is required' })
      }
      
      // Check if package exists
      const existingPackage = db.prepare('SELECT id FROM packages WHERE id = ?').get(id)
      if (!existingPackage) {
        return res.status(404).json({ error: 'Package not found' })
      }
      
      // Build update query dynamically based on provided fields
      let updateFields = []
      let params = []
      
      if (name !== undefined) {
        updateFields.push('name = ?')
        params.push(name)
      }
      
      if (hours !== undefined) {
        updateFields.push('hours = ?')
        params.push(hours)
      }
      
      if (price !== undefined) {
        updateFields.push('price = ?')
        params.push(price)
      }
      
      if (description !== undefined) {
        updateFields.push('description = ?')
        params.push(description)
      }
      
      if (is_active !== undefined) {
        updateFields.push('is_active = ?')
        params.push(is_active ? 1 : 0)
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' })
      }
      
      // Add id to params
      params.push(id)
      
      // Update package
      const stmt = db.prepare(`
        UPDATE packages
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `)
      
      stmt.run(...params)
      return res.status(200).json({ message: 'Package updated successfully' })
    }
    
    // DELETE - Deactivate a package (soft delete)
    else if (req.method === 'DELETE') {
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ error: 'Package ID is required' })
      }
      
      // Check if package exists
      const existingPackage = db.prepare('SELECT id FROM packages WHERE id = ?').get(id)
      if (!existingPackage) {
        return res.status(404).json({ error: 'Package not found' })
      }
      
      // Soft delete by setting is_active to 0
      const stmt = db.prepare('UPDATE packages SET is_active = 0 WHERE id = ?')
      stmt.run(id)
      
      return res.status(200).json({ message: 'Package deactivated successfully' })
    }
    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Packages API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
