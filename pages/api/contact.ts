import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get form data from request body
    const { name, email, phone, message, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Configure email transport using SendGrid
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@simstudio.com',
      to: process.env.CONTACT_FORM_RECIPIENT, // Where contact form submissions should go
      replyTo: email,
      subject: `SimStudio Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  <p><strong>From:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
  <p><strong>Subject:</strong> ${subject}</p>
  <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
    <h3 style="margin-top: 0;">Message:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
  <p style="color: #777; font-size: 12px; margin-top: 30px;">This email was sent from the SimStudio contact form.</p>
</div>
      `,
    };

    // Send the email
    await transport.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
