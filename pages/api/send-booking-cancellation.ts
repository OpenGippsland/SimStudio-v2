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
    const { bookingId, reason, bookingDetails } = req.body;

    if (!bookingId && !bookingDetails) {
      return res.status(400).json({ error: 'Booking ID or booking details are required' });
    }

    // Use booking details if provided, otherwise fetch from database
    let booking;
    
    if (bookingDetails) {
      // Use the booking details provided in the request
      booking = bookingDetails;
      console.log('Using provided booking details for cancellation email');
    } else {
      // Fetch booking details from the database
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          simulator_id,
          start_time,
          end_time,
          coach,
          coaching_fee,
          status,
          users (
            email,
            name
          )
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !data) {
        console.error('Error fetching booking:', bookingError);
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      booking = data;
    }

    // Get user email
    const userEmail = booking.users?.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found' });
    }

    // Format dates for display
    const startDate = new Date(booking.start_time);
    const endDate = new Date(booking.end_time);
    
    // Format in Melbourne timezone
    const melbourneStartDate = new Date(startDate.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
    const melbourneEndDate = new Date(endDate.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
    
    const formattedDate = melbourneStartDate.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedStartTime = melbourneStartDate.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    const formattedEndTime = melbourneEndDate.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Get user's name
    const userName = booking.users?.name || userEmail.split('@')[0];

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
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@simstudio.com',
      to: userEmail,
      subject: 'Your SimStudio Booking Cancellation',
      text: `
Hello ${userName},

Your booking with SimStudio has been cancelled.

Cancelled Booking Details:
- Booking ID: ${booking.id}
- Date: ${formattedDate}
- Time: ${formattedStartTime} - ${formattedEndTime}
- Simulator: ${booking.simulator_id}
${booking.coach && booking.coach !== 'any' ? `- Coach: ${booking.coach}` : ''}
${reason ? `\nReason for cancellation: ${reason}` : ''}

Your simulator credits have been returned to your account.

If you would like to book another session, please visit our website.

Best regards,
The SimStudio Team
      `,
      html: `
<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <img src="${process.env.NEXTAUTH_URL}/assets/SimStudio Logo Main - Black Bg.png" alt="SimStudio Logo" style="display: block; margin: 0 auto; max-width: 200px;">
  
  <h1 style="text-align: center; color: #333; margin-top: 30px;">Booking Cancellation</h1>
  
  <p style="margin-top: 20px;">Hello ${userName},</p>
  
  <p>Your booking with SimStudio has been cancelled.</p>
  
  <div style="background-color: #f7f7f7; border-left: 4px solid #f7c948; padding: 15px; margin: 20px 0;">
    <h2 style="margin-top: 0; color: #333;">Cancelled Booking Details</h2>
    <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.id}</p>
    <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
    <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
    <p style="margin: 5px 0;"><strong>Simulator:</strong> ${booking.simulator_id}</p>
    ${booking.coach && booking.coach !== 'any' ? `<p style="margin: 5px 0;"><strong>Coach:</strong> ${booking.coach}</p>` : ''}
    ${reason ? `<p style="margin: 5px 0;"><strong>Reason for cancellation:</strong> ${reason}</p>` : ''}
  </div>
  
  <p>Your simulator credits have been returned to your account.</p>
  
  <p>If you would like to book another session, please visit our website.</p>
  
  <p style="margin-top: 30px;">Best regards,<br>The SimStudio Team</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
    <p>© ${new Date().getFullYear()} SimStudio. All rights reserved.</p>
    <p>83 Gladstone Street, South Melbourne, VIC, Australia</p>
  </div>
</div>
      `,
    };

    // Send the email
    await transport.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending booking cancellation email:', error);
    return res.status(500).json({ error: 'Failed to send booking cancellation email' });
  }
}
