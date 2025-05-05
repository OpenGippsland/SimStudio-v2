import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { 
      amount, 
      userId, 
      description,
      fromBooking,
      totalHours,  // Extract totalHours from request body
      coachingFee, // Extract coaching fee from request body
      bookingDetails, // Extract booking details from request body
      userInfo // Extract user information from request body
    } = req.body;
    
    // Debug logging
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Booking details:', JSON.stringify(bookingDetails, null, 2));
    console.log('Booking ID:', bookingDetails?.bookingId);
    
    // Parse hours from description if totalHours is not provided
    let hours = totalHours;
    if (!hours && description) {
      const hoursMatch = description.match(/(\d+)\s*hours?/i);
      if (hoursMatch) {
        hours = parseInt(hoursMatch[1], 10);
      }
    }
    
    // Default to 1 hour if we couldn't determine hours
    if (!hours || isNaN(hours)) {
      hours = 1;
    }
    
    // Generate reference ID for tracking
    const referenceId = uuidv4();
    
    // Create Square Checkout link
    const locationId = process.env.SQUARE_LOCATION_ID;
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
    
    const baseUrl = environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';
    
    // Calculate amount in cents
    const amountInCents = Math.round(amount * 100);
    
    // Create checkout link request
    const checkoutRequest = {
      idempotency_key: uuidv4(),
      location_id: locationId,
      checkout_options: {
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?ref=${referenceId}${fromBooking ? '&fromBooking=true' : ''}`,
        merchant_support_email: process.env.MERCHANT_SUPPORT_EMAIL || 'support@simstudio.com',
        ask_for_shipping_address: false,
        // Add pre-populated buyer information if available
        ...(userInfo?.email && { pre_populate_buyer_email: userInfo.email }),
        ...(userInfo?.firstName && userInfo?.lastName && {
          pre_populate_shipping_address: {
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            country: "AU", // Set country to Australia
            ...(userInfo?.phoneNumber && { phone_number: userInfo.phoneNumber }) // Include phone number when available
          }
        })
      },
      order: {
        location_id: locationId,
        reference_id: referenceId,
        line_items: [
          {
            name: description || `SimStudio Booking - ${hours} hours`,
            quantity: "1",
            base_price_money: {
              amount: amountInCents,
              currency: "AUD"
            }
          }
        ],
        metadata: {
          user_id: userId?.toString() || '', // Convert user_id to string
          is_authenticated: 'true',
          reference_id: referenceId,
          hours: hours.toString(),  // Include hours in metadata
          amount: amount.toString(), // Include amount in metadata
          has_coaching_fee: coachingFee ? 'true' : 'false', // Include coaching fee flag
          coaching_fee: coachingFee ? coachingFee.toString() : '0', // Include coaching fee amount
          coach_id: 'none', // Default to 'none' for direct purchases
          booking_id: bookingDetails?.bookingId ? bookingDetails.bookingId.toString() : referenceId // Use booking ID if available, otherwise use reference ID
        }
      }
    };
    
    // Log the request for debugging
    console.log('Square Checkout Request:', JSON.stringify(checkoutRequest, null, 2));
    
    // Specifically log the user information being sent to Square
    console.log('User information being sent to Square:', {
      email: userInfo?.email,
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName,
      country: 'AU'
    });
    
    // Call Square API
    const checkoutResponse = await fetch(`${baseUrl}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2023-09-25',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutRequest)
    });
    
    const checkoutData = await checkoutResponse.json();
    
    // Log the response for debugging
    console.log('Square Checkout Response:', JSON.stringify(checkoutData, null, 2));
    
    if (!checkoutResponse.ok) {
      // Make sure we have a string error message
      const errorDetail = checkoutData?.errors?.[0]?.detail;
      const errorMessage = typeof errorDetail === 'string' ? errorDetail : 'Failed to create checkout';
      throw new Error(errorMessage);
    }
    
    // Return the checkout URL
    return res.status(200).json({
      checkoutUrl: checkoutData.payment_link.url,
      referenceId: referenceId
    });
    
  } catch (error: any) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout' });
  }
}
