import { NextApiRequest, NextApiResponse } from 'next';
import { ensureUniqueConstraintOnPayments } from '../../../lib/migrations/ensure-unique-constraint-on-payments';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Check for admin authorization
  // In a production environment, you would want to add proper authentication here
  const { authorization } = req.headers;
  if (!authorization || authorization !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Run the migration
    const result = await ensureUniqueConstraintOnPayments();
    
    // Return success
    return res.status(200).json({
      success: result.success,
      message: result.message || 'Unique constraint check completed',
      alreadyExists: result.alreadyExists || false
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during migration'
    });
  }
}
