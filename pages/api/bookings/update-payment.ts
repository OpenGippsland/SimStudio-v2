import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingId, paymentRef, status } = req.body;

  if (!bookingId || !paymentRef) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log(`[update-payment] Updating booking ${bookingId} with payment reference ${paymentRef} and status ${status || 'confirmed'}`);

    // Update the booking with the payment reference and status
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        payment_ref: paymentRef,
        payment_status: status || 'confirmed'
      })
      .eq('id', bookingId)
      .select();

    if (error) {
      console.error(`[update-payment] Error updating booking:`, error);
      return res.status(500).json({ error: 'Failed to update booking' });
    }

    console.log(`[update-payment] Successfully updated booking ${bookingId}`);
    return res.status(200).json({ success: true, booking: data });
  } catch (error) {
    console.error('[update-payment] Error:', error);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
}
