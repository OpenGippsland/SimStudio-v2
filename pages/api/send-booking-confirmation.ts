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
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
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

    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError);
      return res.status(404).json({ error: 'Booking not found' });
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
      subject: 'Your SimStudio Booking Confirmation',
      text: `
Hello ${userName},

Thank you for booking with SimStudio!

Booking Details:
- Booking ID: ${booking.id}
- Date: ${formattedDate}
- Time: ${formattedStartTime} - ${formattedEndTime}
- Simulator: ${booking.simulator_id}
${booking.coach && booking.coach !== 'any' ? `- Coach: ${booking.coach}` : ''}
${booking.coaching_fee > 0 ? `- Coaching Fee: $${booking.coaching_fee.toFixed(2)}` : ''}

Please arrive 10 minutes before your session to get set up.

If you need to cancel or reschedule your booking, please do so at least 24 hours in advance through your account on our website.

We look forward to seeing you!

Best regards,
The SimStudio Team
      `,
      html: `
<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <img src="${process.env.NEXTAUTH_URL}/assets/SimStudio Logo Main - Black Bg.png" alt="SimStudio Logo" style="display: block; margin: 0 auto; max-width: 200px;">
  
  <h1 style="text-align: center; color: #333; margin-top: 30px;">Booking Confirmation</h1>
  
  <p style="margin-top: 20px;">Hello ${userName},</p>
  
  <p>Thank you for booking with SimStudio! Your simulator session has been confirmed.</p>
  
  <div style="background-color: #f7f7f7; border-left: 4px solid #f7c948; padding: 15px; margin: 20px 0;">
    <h2 style="margin-top: 0; color: #333;">Booking Details</h2>
    <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.id}</p>
    <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
    <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
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
  
  <p style="margin-top: 30px;">We look forward to seeing you!</p>
  
  <p>Best regards,<br>The SimStudio Team</p>
  
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
    console.error('Error sending booking confirmation email:', error);
    return res.status(500).json({ error: 'Failed to send booking confirmation email' });
  }
}
