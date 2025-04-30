import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { referenceId } = req.body;
    const requestId = Date.now().toString(); // Generate a unique ID for this request for logging
    
    console.log(`[${requestId}] Starting payment verification for reference ID: ${referenceId}`);
    
    if (!referenceId) {
      console.error(`[${requestId}] Missing reference ID in request`);
      return res.status(400).json({ error: 'Reference ID is required' });
    }
    
    // IMPORTANT: First check if this payment has already been processed
    // This is the most critical check to prevent duplicate credits
    console.log(`[${requestId}] Checking if payment ${referenceId} has already been processed`);
    
    try {
      const { data: existingPayment, error: paymentCheckError } = await supabase
        .from('payments')
        .select('id, hours')
        .eq('reference_id', referenceId)
        .single();
      
      if (paymentCheckError && paymentCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.warn(`[${requestId}] Error checking existing payment:`, paymentCheckError);
      }
      
      // If payment already processed, return success without adding credits again
      if (existingPayment) {
        console.log(`[${requestId}] Payment already processed: ${referenceId}, hours: ${existingPayment.hours}`);
        return res.status(200).json({
          success: true,
          hours: existingPayment.hours,
          alreadyProcessed: true,
          message: "This payment has already been processed. Your credits have been added to your account."
        });
      }
    } catch (err) {
      console.error(`[${requestId}] Error checking existing payment:`, err);
      // Continue to verify with Square - we'll check again before adding credits
    }
    
    // Verify payment with Square
    const locationId = process.env.SQUARE_LOCATION_ID;
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
    
    const baseUrl = environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';
    
    console.log(`[${requestId}] Verifying payment with Square API`);
    
    // Get order by reference ID
    const orderResponse = await fetch(`${baseUrl}/v2/orders/search`, {
      method: 'POST',
      headers: {
        'Square-Version': '2023-09-25',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location_ids: [locationId],
        query: {
          filter: {
            state_filter: {
              states: ["COMPLETED", "OPEN"] // Include OPEN orders as well
            }
          },
          sort: {
            sort_field: "CREATED_AT",
            sort_order: "DESC"
          }
        }
      })
    });
    
    const orderData = await orderResponse.json();
    // Log only essential information, not the full response
    console.log(`[${requestId}] Square Orders API response received with ${orderData.orders?.length || 0} orders`);
    
    if (!orderResponse.ok) {
      const errorMessage = orderData?.errors?.[0]?.detail || 'Failed to verify payment';
      console.error(`[${requestId}] Square API error:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    // Find the order with matching reference ID
    const order = orderData.orders?.find(o => o.reference_id === referenceId);
    
    if (!order) {
      console.error(`[${requestId}] Order not found with reference ID: ${referenceId}`);
      console.log(`[${requestId}] Available orders:`, orderData.orders?.map(o => o.reference_id));
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`[${requestId}] Found order with ID: ${order.id}, state: ${order.state}`);
    
    // Extract metadata
    const userId = order.metadata?.user_id;
    
    if (!userId) {
      console.error(`[${requestId}] Missing user ID in order metadata`);
      return res.status(400).json({ error: 'Missing user ID in order metadata' });
    }
    
    // Get hours from metadata if available, otherwise calculate from amount
    let hours: number;
    let totalAmount: number;
    
    if (order.metadata?.hours) {
      // Use hours from metadata (preferred method)
      hours = parseInt(order.metadata.hours, 10);
      console.log(`[${requestId}] Using hours from metadata: ${hours}`);
    } else {
      // Fallback: Calculate hours based on amount
      totalAmount = order.total_money.amount / 100; // Convert from cents
      console.log(`[${requestId}] Payment amount: ${totalAmount}`);
      
      const hourlyRate = 50;
      hours = Math.floor(totalAmount / hourlyRate);
      console.log(`[${requestId}] Calculated hours (fallback): ${hours}`);
    }
    
    // If we didn't get totalAmount from the calculation above, get it from metadata or order
    if (totalAmount === undefined) {
      if (order.metadata?.amount) {
        totalAmount = parseFloat(order.metadata.amount);
      } else {
        totalAmount = order.total_money.amount / 100;
      }
      console.log(`[${requestId}] Payment amount: ${totalAmount}`);
    }
    
    try {
      // IMPORTANT: Check AGAIN if this payment has already been processed
      // This double-check helps prevent race conditions
      console.log(`[${requestId}] Double-checking if payment ${referenceId} has already been processed`);
      
      const { data: existingPayment, error: paymentCheckError } = await supabase
        .from('payments')
        .select('id')
        .eq('reference_id', referenceId)
        .single();
      
      if (paymentCheckError && paymentCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.warn(`[${requestId}] Error in double-check for existing payment:`, paymentCheckError);
      }
      
      // If payment already processed, return success without adding credits again
      if (existingPayment) {
        console.log(`[${requestId}] Payment already processed in double-check: ${referenceId}`);
        return res.status(200).json({
          success: true,
          hours: hours,
          alreadyProcessed: true,
          message: "This payment has already been processed. Your credits have been added to your account."
        });
      }
      
      // First try to insert the payment record to claim this reference_id
      // This uses the unique constraint to prevent duplicate processing
      console.log(`[${requestId}] Recording payment to prevent duplicate processing`);
      
      // Hardcoded mapping for user ID 27 to auth user ID
      let authUserId = userId;
      if (userId === '27') {
        authUserId = '987ffed6-f3de-4961-8079-797a3bb3e860';
        console.log(`[${requestId}] Using hardcoded auth user ID: ${authUserId} for public user ID: ${userId}`);
      }
      
      // Try to insert the payment record with the auth user ID
      let paymentInsertError;
      let paymentRecorded = false;
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .insert({ 
            user_id: authUserId, 
            reference_id: referenceId,
            amount: totalAmount,
            hours: hours
          })
          .select()
          .single();
          
        paymentInsertError = error;
        
        if (!error) {
          paymentRecorded = true;
          console.log(`[${requestId}] Successfully recorded payment: ${referenceId}`);
        }
      } catch (err) {
        console.error(`[${requestId}] Error inserting payment record:`, err);
        paymentInsertError = err;
      }
      
      if (paymentInsertError) {
        // If error is a unique constraint violation, another request beat us to it
        if (paymentInsertError.code === '23505') { // 23505 is the Postgres error code for unique_violation
          console.log(`[${requestId}] Another request already processed this payment: ${referenceId}`);
          return res.status(200).json({
            success: true,
            hours: hours,
            alreadyProcessed: true,
            message: "This payment has already been processed. Your credits have been added to your account."
          });
        }
        
        console.error(`[${requestId}] Error recording payment:`, paymentInsertError);
        throw paymentInsertError;
      }
      
      console.log(`[${requestId}] Successfully recorded payment: ${referenceId}`);
      
      // Now that we've successfully recorded the payment, add credits to the user
      console.log(`[${requestId}] Adding ${hours} credits to user ${userId}`);
      
      // Add credits to existing user - use the original user ID for credits table
      const { data: currentCredits, error: creditsError } = await supabase
        .from('credits')
        .select('simulator_hours')
        .eq('user_id', userId)
        .single();
      
      if (creditsError && creditsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.warn(`[${requestId}] Error fetching credits:`, creditsError);
        // Continue anyway - we'll try to insert new credits
      }
      
      if (currentCredits) {
        // Update existing credits
        console.log(`[${requestId}] Updating existing credits from ${currentCredits.simulator_hours} to ${currentCredits.simulator_hours + hours}`);
        
        const { error: updateError } = await supabase
          .from('credits')
          .update({ 
            simulator_hours: currentCredits.simulator_hours + hours 
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error(`[${requestId}] Error updating credits:`, updateError);
          throw updateError;
        } else {
          console.log(`[${requestId}] Successfully updated credits for user ${userId}`);
        }
      } else {
        // Insert new credits record
        console.log(`[${requestId}] Creating new credits record with ${hours} hours for user ${userId}`);
        
        const { error: insertError } = await supabase
          .from('credits')
          .insert({ 
            user_id: userId, 
            simulator_hours: hours 
          });
        
        if (insertError) {
          console.error(`[${requestId}] Error inserting credits:`, insertError);
          throw insertError;
        } else {
          console.log(`[${requestId}] Successfully created credits for user ${userId}`);
        }
      }
      
      console.log(`[${requestId}] Payment verification and credit addition completed successfully`);
      
      return res.status(200).json({
        success: true,
        hours: hours,
        message: `${hours} simulator hours have been added to your account.`
      });
      
    } catch (err) {
      console.error(`[${requestId}] Error processing credits:`, err);
      throw err;
    }
    
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: error.message || 'Payment verification failed' });
  }
}
