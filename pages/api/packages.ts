import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

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
        const { data: package_, error } = await supabase
          .from('packages')
          .select('*')
          .eq('id', typeof id === 'string' ? parseInt(id, 10) : parseInt(id[0], 10))
          .eq('is_active', true)
          .single();
        
        if (error || !package_) {
          return res.status(404).json({ error: 'Package not found' });
        }
        
        return res.status(200).json(package_);
      } else {
        // Get all active packages
        const { data: packages, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_active', true)
          .order('hours', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        return res.status(200).json(packages || []);
      }
    }
    
    // POST - Create a new package
    else if (req.method === 'POST') {
      const { name, hours, price, description } = req.body;
      
      // Validate required fields
      if (!name || !hours || !price) {
        return res.status(400).json({ error: 'Name, hours, and price are required' });
      }
      
      // Validate data types
      if (typeof name !== 'string' || (description && typeof description !== 'string')) {
        return res.status(400).json({ error: 'Name and description must be strings' });
      }
      
      if (isNaN(Number(hours)) || isNaN(Number(price))) {
        return res.status(400).json({ error: 'Hours and price must be numbers' });
      }
      
      // Insert new package
      const { data, error } = await supabase
        .from('packages')
        .insert({
          name,
          hours: Number(hours),
          price: Number(price),
          description,
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return res.status(201).json({ id: data.id });
    }
    
    // PUT - Update an existing package
    else if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, hours, price, description, is_active } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Package ID is required' });
      }
      
      // Check if package exists
      const { data: existingPackage, error: checkError } = await supabase
        .from('packages')
        .select('id')
        .eq('id', typeof id === 'string' ? parseInt(id, 10) : parseInt(id[0], 10))
        .single();
      
      if (checkError || !existingPackage) {
        return res.status(404).json({ error: 'Package not found' });
      }
      
      // Build update object based on provided fields
      const updateData: any = {};
      
      if (name !== undefined) updateData.name = name;
      if (hours !== undefined) updateData.hours = Number(hours);
      if (price !== undefined) updateData.price = Number(price);
      if (description !== undefined) updateData.description = description;
      if (is_active !== undefined) updateData.is_active = Boolean(is_active);
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      
      // Update package
      const { error } = await supabase
        .from('packages')
        .update(updateData)
        .eq('id', typeof id === 'string' ? parseInt(id, 10) : parseInt(id[0], 10));
      
      if (error) {
        throw error;
      }
      
      return res.status(200).json({ message: 'Package updated successfully' });
    }
    
    // DELETE - Deactivate a package (soft delete)
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Package ID is required' });
      }
      
      // Check if package exists
      const { data: existingPackage, error: checkError } = await supabase
        .from('packages')
        .select('id')
        .eq('id', typeof id === 'string' ? parseInt(id, 10) : parseInt(id[0], 10))
        .single();
      
      if (checkError || !existingPackage) {
        return res.status(404).json({ error: 'Package not found' });
      }
      
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('packages')
        .update({ is_active: false })
        .eq('id', typeof id === 'string' ? parseInt(id, 10) : parseInt(id[0], 10));
      
      if (error) {
        throw error;
      }
      
      return res.status(200).json({ message: 'Package deactivated successfully' });
    }
    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Packages API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
