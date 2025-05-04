import { NextApiRequest, NextApiResponse } from 'next';
import { addPaymentStatusToBookings } from '../../../lib/migrations/add-payment-status-to-bookings';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await addPaymentStatusToBookings();
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully added payment_status column to bookings table' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
