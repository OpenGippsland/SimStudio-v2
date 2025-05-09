import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';

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
    
    // Debug log to see what's happening with user info
    console.log('User info received in create-checkout:', JSON.stringify(userInfo, null, 2));
    
    // Get user data from database to ensure we have the most up-to-date information
    // This is a workaround for the issue where the user's first_name and last_name fields
    // are not being correctly passed from the frontend
    let firstName = userInfo?.firstName || '';
    let lastName = userInfo?.lastName || '';
    
    // If we have a userId, try to get the user's first_name and last_name from the database
    if (userId) {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('first_name, last_name, name')
          .eq('id', parseInt(userId))
          .single();
        
        if (!error && userData) {
          console.log('User data from database:', JSON.stringify(userData, null, 2));
          
          // Use the database values if they exist
          if (userData.first_name) firstName = userData.first_name;
          if (userData.last_name) lastName = userData.last_name;
          
          // If both are still empty but name exists, try to extract from name
          if (!firstName && !lastName && userData.name && userData.name.includes(' ')) {
            const nameParts = userData.name.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
          }
          
          console.log('Using name data:', { firstName, lastName });
        }
      } catch (error) {
        console.error('Error fetching user data from database:', error);
      }
    }
    
    // Prepare pre-populated data
    const prePopulatedData: any = {
      buyer_email: userInfo?.email || '',
      buyer_address: {
        first_name: firstName || userInfo?.firstName || '',
        last_name: lastName || userInfo?.lastName || '',
        address_line_1: '',
        locality: '',
        administrative_district_level_1: '',
        postal_code: '',
        country: 'AU'
      }
    };
    
    // Add first and last name directly to the pre-populated data
    // This is a workaround for a Square issue where the name in buyer_address is not always used
    prePopulatedData.first_name = firstName || userInfo?.firstName || '';
    prePopulatedData.last_name = lastName || userInfo?.lastName || '';
    
    // Only add phone number if it exists and is valid
    if (userInfo?.phoneNumber) {
      // Validate phone number format for Square (E.164 format)
      // For Australian numbers, this should be +61XXXXXXXXX (total 12 characters)
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      
      // Format the phone number if needed
      let formattedPhone = userInfo.phoneNumber;
      
      // If it's an Australian number without the + prefix, add it
      if (formattedPhone.startsWith('61') && !formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }
      
      // If it's an Australian mobile starting with 0, convert to +61 format
      if (formattedPhone.startsWith('0') && formattedPhone.length === 10) {
        formattedPhone = '+61' + formattedPhone.substring(1);
      }
      
      // Final validation check
      if (phoneRegex.test(formattedPhone)) {
        console.log('Valid phone number format:', formattedPhone);
        prePopulatedData.buyer_phone_number = formattedPhone;
        prePopulatedData.buyer_address.phone_number = formattedPhone;
      } else {
        console.log('Invalid phone number format, not including in request:', formattedPhone);
      }
    }
    
    // Create checkout link request
    const checkoutRequest = {
      idempotency_key: uuidv4(),
      location_id: locationId,
      checkout_options: {
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?ref=${referenceId}${fromBooking ? '&fromBooking=true' : ''}`,
        merchant_support_email: process.env.MERCHANT_SUPPORT_EMAIL || 'support@simstudio.com',
        ask_for_shipping_address: false,
      },
      pre_populated_data: prePopulatedData,
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
      lastName: userInfo?.lastName || '',
      phoneNumber: userInfo?.phoneNumber || '',
      country: 'AU'
    });
    
    // Log the pre-populated data for debugging
    console.log('Pre-populated data being sent to Square:', JSON.stringify(prePopulatedData, null, 2));
    
    // Log the full checkout request for debugging
    console.log('Full checkout request being sent to Square:', JSON.stringify(checkoutRequest, null, 2));
    
    // Log the full checkout request options for debugging
    console.log('Checkout options being sent to Square:', JSON.stringify(checkoutRequest.checkout_options, null, 2));
    
    // Call Square API
    const checkoutResponse = await fetch(`${baseUrl}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-05-04',
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
