import { NextApiRequest, NextApiResponse } from 'next';
import { addMobileNumberToUsers } from '../../../lib/migrations/add-mobile-number-to-users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Run the migration
    const result = await addMobileNumberToUsers();
    
    // Return the result
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Migration error:', error);
    return res.status(500).json({ 
      error: 'Failed to run migration', 
      details: error.message 
    });
  }
}
