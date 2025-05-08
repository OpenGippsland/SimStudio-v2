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
    
    // Check if this payment includes a coaching fee
    const hasCoachingFee = order.metadata?.has_coaching_fee === 'true';
    let coachingFee = 0;
    let coachId: number | null = null;
    
    if (hasCoachingFee) {
      coachingFee = parseFloat(order.metadata?.coaching_fee || '0');
      // Convert coach_id to number if it exists
      if (order.metadata?.coach_id) {
        coachId = parseInt(order.metadata.coach_id, 10);
      }
      console.log(`[${requestId}] Payment includes coaching fee: $${coachingFee} for coach: ${coachId}`);
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
      
      // Process user ID for payments and credits tables
      // Both tables now expect integer user IDs from NextAuth
      
      // Convert user ID to integer if it's a numeric string
      const numericUserId = /^\d+$/.test(userId) ? parseInt(userId, 10) : userId;
      console.log(`[${requestId}] Using user ID ${numericUserId} for payment record`);
      
      // Try to insert the payment record with the processed user ID
      let paymentInsertError;
      let paymentRecorded = false;
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .insert({ 
            user_id: numericUserId, 
            reference_id: referenceId,
            amount: totalAmount,
            hours: hours,
            has_coaching_fee: hasCoachingFee,
            coaching_fee: coachingFee,
            coach_id: coachId
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
      
      // Check if there's a booking ID in the order metadata
      const bookingId = order.metadata?.booking_id ? parseInt(order.metadata.booking_id, 10) : null;
      
      // If there's a booking ID, update the booking status to confirmed
      if (bookingId) {
        try {
          console.log(`[${requestId}] Updating booking status for booking ID: ${bookingId}`);
          
          // Get booking details to determine how many hours it uses
          const { data: bookingData, error: bookingFetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();
            
          if (bookingFetchError) {
            console.error(`[${requestId}] Error fetching booking details:`, bookingFetchError);
            // Continue anyway - we'll still update the booking status
          }
          
          // Calculate booking duration in hours
          let bookingHours = 0;
          if (bookingData) {
            const startTime = new Date(bookingData.start_time);
            const endTime = new Date(bookingData.end_time);
            bookingHours = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
            console.log(`[${requestId}] Booking duration: ${bookingHours} hours`);
          }
          
          const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({ 
              payment_status: 'confirmed',
              payment_ref: referenceId
            })
            .eq('id', bookingId);
            
          if (bookingUpdateError) {
            console.error(`[${requestId}] Error updating booking status:`, bookingUpdateError);
            // Continue anyway - we'll still process the payment
          } else {
            console.log(`[${requestId}] Successfully updated booking status to confirmed`);
          }
          
          // For bookings, we need to:
          // 1. Add all purchased credits to the user's account
          // 2. Then deduct the credits needed for the booking
          if (bookingHours > 0) {
            console.log(`[${requestId}] Adding all ${hours} purchased hours to user account, then deducting ${bookingHours} hours for the booking.`);
            
            // First add all purchased credits to the user's account
            await addCreditsToUser(numericUserId, hours, requestId);
            
            // Then deduct the credits needed for the booking
            await deductCreditsForBooking(numericUserId, bookingHours, requestId);
          } else {
            console.log(`[${requestId}] Could not determine booking hours. Adding all ${hours} purchased hours to user account.`);
            
            // Add all purchased credits to user's account
            await addCreditsToUser(numericUserId, hours, requestId);
          }
        } catch (err) {
          console.error(`[${requestId}] Error updating booking status:`, err);
          // Continue anyway - we'll still process the payment
        }
      } else {
        // Only add credits to the user's account if this payment is not for a booking
        console.log(`[${requestId}] Adding ${hours} credits to user ${userId}`);
        
        // Add all purchased credits to user's account
        await addCreditsToUser(numericUserId, hours, requestId);
      }
      
      // Helper function to deduct credits from a user's account for a booking
      async function deductCreditsForBooking(userId: number, creditsToDeduct: number, requestId: string) {
        console.log(`[${requestId}] Deducting ${creditsToDeduct} credits from user ${userId} for booking`);
        
        const { data: currentCredits, error: creditsError } = await supabase
          .from('credits')
          .select('simulator_hours')
          .eq('user_id', userId)
          .single();
        
        if (creditsError) {
          console.error(`[${requestId}] Error fetching credits for deduction:`, creditsError);
          return; // Skip deduction if we can't fetch current credits
        }
        
        if (!currentCredits) {
          console.error(`[${requestId}] No credits record found for user ${userId}`);
          return; // Skip deduction if no credits record exists
        }
        
        // Calculate new credit balance
        const newBalance = Math.max(0, currentCredits.simulator_hours - creditsToDeduct);
        console.log(`[${requestId}] Updating credits from ${currentCredits.simulator_hours} to ${newBalance} after booking deduction`);
        
        const { error: updateError } = await supabase
          .from('credits')
          .update({ 
            simulator_hours: newBalance
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error(`[${requestId}] Error deducting credits:`, updateError);
        } else {
          console.log(`[${requestId}] Successfully deducted ${creditsToDeduct} credits for booking`);
        }
      }
      
      // Helper function to add credits to a user's account
      async function addCreditsToUser(userId: number, creditsToAdd: number, requestId: string) {
        console.log(`[${requestId}] Adding ${creditsToAdd} credits to user ${userId}`);
        
        // If there's a coaching fee, process payment to the coach
        if (hasCoachingFee && coachingFee > 0 && coachId !== null) {
          try {
            console.log(`[${requestId}] Processing coaching fee payment of $${coachingFee} to coach ${coachId}`);
            
            // Get coach profile to verify coach exists
            const { data: coachProfile, error: coachError } = await supabase
              .from('coach_profiles')
              .select('*, users!coach_profiles_user_id_fkey(name)')
              .eq('id', coachId)
              .single();
              
            if (coachError) {
              console.error(`[${requestId}] Error fetching coach profile:`, coachError);
              // Continue anyway - we'll still record the payment
            } else {
              // Access the coach name from the joined users table
              const coachName = coachProfile.users?.name || 'Unknown Coach';
              console.log(`[${requestId}] Found coach profile for ${coachName}`);
              
              // Insert into coach_payments table
              const { error: coachPaymentError } = await supabase
                .from('coach_payments')
                .insert({
                  coach_id: coachId,
                  user_id: numericUserId,
                  amount: coachingFee,
                  reference_id: referenceId,
                  status: 'completed',
                  booking_id: order.metadata?.booking_id ? parseInt(order.metadata.booking_id, 10) : null
                });
                
              if (coachPaymentError) {
                console.error(`[${requestId}] Error recording coach payment:`, coachPaymentError);
                // Continue anyway - we'll still add credits to the user
              } else {
                console.log(`[${requestId}] Successfully recorded coach payment`);
              }
            }
          } catch (err) {
            console.error(`[${requestId}] Error processing coach payment:`, err);
            // Continue anyway - we'll still add credits to the user
          }
        }
        
        // Add credits to existing user
        // Note: The credits table uses numeric user IDs, not UUIDs
        // We're using the numericUserId we defined earlier
        
        const { data: currentCredits, error: creditsError } = await supabase
          .from('credits')
          .select('simulator_hours')
          .eq('user_id', numericUserId)
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
            .eq('user_id', numericUserId);
          
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
              user_id: numericUserId, 
              simulator_hours: hours 
            });
          
          if (insertError) {
            console.error(`[${requestId}] Error inserting credits:`, insertError);
            throw insertError;
          } else {
            console.log(`[${requestId}] Successfully created credits for user ${userId}`);
          }
        }
      }
      
      // Send payment confirmation email
      try {
        console.log(`[${requestId}] Sending payment confirmation email`);
        
        // Call the payment confirmation email API
        const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/send-payment-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referenceId }),
        });
        
        if (!emailResponse.ok) {
          console.error(`[${requestId}] Failed to send payment confirmation email:`, await emailResponse.text());
        } else {
          console.log(`[${requestId}] Payment confirmation email sent successfully`);
        }
      } catch (emailError) {
        // Log the error but don't fail the payment verification
        console.error(`[${requestId}] Error sending payment confirmation email:`, emailError);
      }
      
      console.log(`[${requestId}] Payment verification and credit addition completed successfully`);
      
      return res.status(200).json({
        success: true,
        hours: hours,
        message: hasCoachingFee && coachingFee > 0 
          ? `${hours} simulator hours have been added to your account and coaching fee has been processed.`
          : `${hours} simulator hours have been added to your account.`,
        coachingFee: hasCoachingFee ? coachingFee : undefined
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
