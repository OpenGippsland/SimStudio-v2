import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, referenceId } = req.body;

    if (!paymentId && !referenceId) {
      return res.status(400).json({ error: 'Payment ID or Reference ID is required' });
    }

    // Get payment details
    let payment;
    let paymentError;

    if (paymentId) {
      const result = await supabase
        .from('payments')
        .select(`
          id,
          user_id,
          reference_id,
          amount,
          hours,
          created_at,
          users (
            email,
            name
          )
        `)
        .eq('id', paymentId)
        .single();
      
      payment = result.data;
      paymentError = result.error;
    } else if (referenceId) {
      const result = await supabase
        .from('payments')
        .select(`
          id,
          user_id,
          reference_id,
          amount,
          hours,
          created_at,
          users (
            email,
            name
          )
        `)
        .eq('reference_id', referenceId)
        .single();
      
      payment = result.data;
      paymentError = result.error;
    }

    // Check if this payment is associated with a booking
    let booking = null;
    if (payment) {
      const { data: associatedBooking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id,
          simulator_id,
          start_time,
          end_time,
          coach,
          coaching_fee,
          status
        `)
        .eq('payment_ref', payment.reference_id)
        .single();
      
      if (!bookingError && associatedBooking) {
        booking = associatedBooking;
      }
    }

    if (paymentError || !payment) {
      console.error('Error fetching payment:', paymentError);
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Get user email
    const userEmail = payment.users?.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found' });
    }

    // Format date for display
    const paymentDate = new Date(payment.created_at);
    
    // Format in Melbourne timezone
    const melbournePaymentDate = new Date(paymentDate.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
    
    const formattedDate = melbournePaymentDate.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = melbournePaymentDate.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Get user's name
    const userName = payment.users?.name || userEmail.split('@')[0];

    // Configure email transport using SendGrid
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Prepare email content
    let subject = 'Your SimStudio Payment Receipt';
    let textContent = '';
    let htmlContent = '';

    // Format booking dates if booking exists
    let formattedBookingDate = '';
    let formattedBookingStartTime = '';
    let formattedBookingEndTime = '';

    if (booking) {
      const bookingStartDate = new Date(booking.start_time);
      const bookingEndDate = new Date(booking.end_time);
      
      // Format in Melbourne timezone
      const melbourneBookingStartDate = new Date(bookingStartDate.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
      const melbourneBookingEndDate = new Date(bookingEndDate.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
      
      formattedBookingDate = melbourneBookingStartDate.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      formattedBookingStartTime = melbourneBookingStartDate.toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      
      formattedBookingEndTime = melbourneBookingEndDate.toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      // Update subject if booking exists
      subject = 'Your SimStudio Payment Receipt and Booking Confirmation';
    }

    // Create text content
    textContent = `
Hello ${userName},

Thank you for your payment to SimStudio!

Payment Details:
- Reference ID: ${payment.reference_id}
- Amount: $${payment.amount.toFixed(2)}
- Simulator Hours: ${payment.hours}
- Date: ${formattedDate}
- Time: ${formattedTime}

Your simulator credits have been added to your account.
`;

    if (booking) {
      textContent += `
Booking Details:
- Booking ID: ${booking.id}
- Date: ${formattedBookingDate}
- Time: ${formattedBookingStartTime} - ${formattedBookingEndTime}
- Simulator: ${booking.simulator_id}
${booking.coach && booking.coach !== 'any' ? `- Coach: ${booking.coach}` : ''}
${booking.coaching_fee > 0 ? `- Coaching Fee: $${booking.coaching_fee.toFixed(2)}` : ''}

Please arrive 10 minutes before your session to get set up.
`;
    } else {
      textContent += `
You can now book simulator sessions using these credits.
`;
    }

    textContent += `
If you have any questions about your payment, please contact us.

Best regards,
The SimStudio Team
`;

    // Create HTML content
    htmlContent = `
<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <img src="${process.env.NEXTAUTH_URL}/assets/SimStudio Logo Main - Black Bg.png" alt="SimStudio Logo" style="display: block; margin: 0 auto; max-width: 200px;">
  
  <h1 style="text-align: center; color: #333; margin-top: 30px;">${booking ? 'Payment Receipt & Booking Confirmation' : 'Payment Receipt'}</h1>
  
  <p style="margin-top: 20px;">Hello ${userName},</p>
  
  <p>Thank you for your payment to SimStudio!</p>
  
  <div style="background-color: #f7f7f7; border-left: 4px solid #f7c948; padding: 15px; margin: 20px 0;">
    <h2 style="margin-top: 0; color: #333;">Payment Details</h2>
    <p style="margin: 5px 0;"><strong>Reference ID:</strong> ${payment.reference_id}</p>
    <p style="margin: 5px 0;"><strong>Amount:</strong> $${payment.amount.toFixed(2)}</p>
    <p style="margin: 5px 0;"><strong>Simulator Hours:</strong> ${payment.hours}</p>
    <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
    <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
  </div>
`;

    if (booking) {
      htmlContent += `
  <div style="background-color: #f7f7f7; border-left: 4px solid #f7c948; padding: 15px; margin: 20px 0;">
    <h2 style="margin-top: 0; color: #333;">Booking Details</h2>
    <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.id}</p>
    <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedBookingDate}</p>
    <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedBookingStartTime} - ${formattedBookingEndTime}</p>
    <p style="margin: 5px 0;"><strong>Simulator:</strong> ${booking.simulator_id}</p>
    ${booking.coach && booking.coach !== 'any' ? `<p style="margin: 5px 0;"><strong>Coach:</strong> ${booking.coach}</p>` : ''}
    ${booking.coaching_fee > 0 ? `<p style="margin: 5px 0;"><strong>Coaching Fee:</strong> $${booking.coaching_fee.toFixed(2)}</p>` : ''}
  </div>
  
  <h3 style="color: #333;">Important Information</h3>
  
  <ul>
    <li>Please arrive 10 minutes before your session to get set up.</li>
    <li>Our facility is located at 83 Gladstone Street, South Melbourne, VIC.</li>
    <li>If you need to cancel or reschedule, please do so at least 24 hours in advance through your account on our website.</li>
  </ul>
`;
    } else {
      htmlContent += `
  <p>Your simulator credits have been added to your account. You can now book simulator sessions using these credits.</p>
`;
    }

    htmlContent += `
  <p>If you have any questions about your payment, please contact us.</p>
  
  <p style="margin-top: 30px;">Best regards,<br>The SimStudio Team</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
    <p>© ${new Date().getFullYear()} SimStudio. All rights reserved.</p>
    <p>83 Gladstone Street, South Melbourne, VIC, Australia</p>
  </div>
</div>
`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@simstudio.com',
      to: userEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    // Send the email
    await transport.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return res.status(500).json({ error: 'Failed to send payment confirmation email' });
  }
}
