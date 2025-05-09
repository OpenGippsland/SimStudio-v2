import { NextApiRequest, NextApiResponse } from 'next';
import { addHourlyRatePackage } from '../../../lib/migrations/add-hourly-rate-package';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Run the migration
    const result = await addHourlyRatePackage();
    
    if (result.success) {
      return res.status(200).json({ message: 'Hourly rate package migration completed successfully' });
    } else {
      return res.status(500).json({ error: 'Migration failed', details: result.error });
    }
  } catch (error) {
    console.error('Error running hourly rate package migration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
