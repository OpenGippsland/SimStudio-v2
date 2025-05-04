import type { NextApiRequest, NextApiResponse } from 'next';
import { addPaymentRefToBookings } from '../../../lib/migrations/add-payment-ref-to-bookings';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Run the migration
    const result = await addPaymentRefToBookings();

    if (!result.success) {
      return res.status(500).json({ error: 'Migration failed', details: result.error });
    }

    return res.status(200).json({ success: true, message: 'Successfully added payment_ref column to bookings table' });
  } catch (error) {
    console.error('Error in migration API:', error);
    return res.status(500).json({ error: 'Migration failed', details: error });
  }
}
