import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5; // Maximum 5 submissions per hour per IP
const ipRequestCounts: Record<string, { count: number; resetTime: number }> = {};

// Email regex for better validation
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress || 
                     'unknown';
    
    const ipKey = Array.isArray(clientIp) ? clientIp[0] : clientIp;
    
    // Check rate limit
    if (ipRequestCounts[ipKey]) {
      const record = ipRequestCounts[ipKey];
      
      // Reset count if the window has passed
      if (Date.now() > record.resetTime) {
        record.count = 1;
        record.resetTime = Date.now() + RATE_LIMIT_WINDOW;
      } else if (record.count >= MAX_REQUESTS_PER_IP) {
        // If rate limit exceeded, return 429 Too Many Requests
        // But make it look like success to not alert sophisticated bots
        return res.status(200).json({ success: true });
      } else {
        record.count += 1;
      }
    } else {
      // First request from this IP
      ipRequestCounts[ipKey] = {
        count: 1,
        resetTime: Date.now() + RATE_LIMIT_WINDOW
      };
    }
    
    // Get form data from request body
    const { name, email, phone, message, subject, website, notes, formToken, mathAnswer } = req.body;

    // Bot detection - check honeypot fields
    if (website || notes) {
      // If honeypot fields are filled, silently reject but return success
      console.log('Bot detected: honeypot fields filled');
      return res.status(200).json({ success: true });
    }
    
    // Check for form token
    if (!formToken) {
      console.log('Bot detected: missing form token');
      return res.status(200).json({ success: true });
    }
    
    // Check for math challenge answer - make this more flexible for Safari compatibility
    // Safari might handle the math challenge differently, so we'll make this check optional
    if (!mathAnswer && !req.body.math_challenge) {
      console.log('Bot detected: missing math answer and math challenge');
      // Still allow the form to be submitted, but log the issue
      console.log('Allowing submission without math challenge for Safari compatibility');
    }
    
    // Validate required fields
    if (!name || !email || !message || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // More thorough email validation
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
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
      to: process.env.CONTACT_FORM_RECIPIENT || 'hello@simstudio.com.au', // Fallback recipient if env var is missing
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
