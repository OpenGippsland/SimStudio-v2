import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { referenceId } = req.body;

  if (!referenceId) {
    return res.status(400).json({ error: 'Missing reference ID' });
  }

  try {
    console.log(`[find-by-payment] Looking up payment with reference ID: ${referenceId}`);

    // First, check if we have a booking with this payment reference
    const { data: bookingWithRef, error: bookingRefError } = await supabase
      .from('bookings')
      .select('id')
      .eq('payment_ref', referenceId)
      .single();
    
    if (!bookingRefError && bookingWithRef) {
      console.log(`[find-by-payment] Found booking with payment_ref: ${bookingWithRef.id}`);
      return res.status(200).json({ bookingId: bookingWithRef.id });
    }
    
    // Check if there's a payment record with this reference ID
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('user_id')
      .eq('reference_id', referenceId)
      .single();
      
    if (!paymentError && paymentData && paymentData.user_id) {
      // If we found a payment, look for a pending booking for this user
      // Convert user_id to number if it's a string
      const userId = typeof paymentData.user_id === 'string' 
        ? parseInt(paymentData.user_id, 10) 
        : paymentData.user_id;
        
      const { data: pendingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', userId)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (!bookingsError && pendingBookings && pendingBookings.length > 0) {
        const bookingId = pendingBookings[0].id;
        console.log(`[find-by-payment] Found pending booking for user from payment record: ${bookingId}`);
        return res.status(200).json({ bookingId });
      }
    }
    
    // If no booking found in payments table, check the Square order
    const locationId = process.env.SQUARE_LOCATION_ID;
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
    
    const baseUrl = environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';
    
    // Get all orders and filter by reference ID
    const orderResponse = await fetch(`${baseUrl}/v2/orders/search`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-05-04',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location_ids: [locationId],
        query: {
          filter: {
            state_filter: {
              states: ["COMPLETED", "OPEN"]
            }
          },
          sort: {
            sort_field: "CREATED_AT",
            sort_order: "DESC"
          }
        }
      })
    });
    
    if (!orderResponse.ok) {
      console.error(`[find-by-payment] Error searching orders:`, await orderResponse.text());
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const orderData = await orderResponse.json();
    console.log(`[find-by-payment] Found ${orderData.orders?.length || 0} orders`);
    
    // Log all reference IDs to help debug
    if (orderData.orders && orderData.orders.length > 0) {
      console.log(`[find-by-payment] Order reference IDs:`, orderData.orders.map(o => o.reference_id));
    }
    
    // Find the order with matching reference ID
    const order = orderData.orders?.find(o => o.reference_id === referenceId);
    
    if (!order) {
      console.log(`[find-by-payment] No order found with reference ID: ${referenceId}`);
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`[find-by-payment] Found order with ID: ${order.id}`);
    
    // Check if the order has metadata with a booking ID
    if (order.metadata && order.metadata.booking_id) {
      const bookingId = parseInt(order.metadata.booking_id, 10);
      console.log(`[find-by-payment] Found booking ID in order metadata: ${bookingId}`);
      return res.status(200).json({ bookingId });
    }

    // If no booking ID found in metadata, check if there's a pending booking that matches
    // the user ID from the order
    if (order.metadata && order.metadata.user_id) {
      // Convert user_id to number if it's a string
      const userId = typeof order.metadata.user_id === 'string' 
        ? parseInt(order.metadata.user_id, 10) 
        : order.metadata.user_id;
      
      // Look for pending bookings for this user
      const { data: pendingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', userId)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (bookingsError) {
        console.error(`[find-by-payment] Error finding pending bookings:`, bookingsError);
      } else if (pendingBookings && pendingBookings.length > 0) {
        const bookingId = pendingBookings[0].id;
        console.log(`[find-by-payment] Found pending booking for user: ${bookingId}`);
        return res.status(200).json({ bookingId });
      }
    }

    // No booking ID found
    return res.status(404).json({ error: 'No booking found for this payment' });
  } catch (error) {
    console.error('[find-by-payment] Error:', error);
    return res.status(500).json({ error: 'Failed to find booking' });
  }
}
