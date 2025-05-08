import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserByEmail } from '../../../lib/db-supabase';
import { supabase } from '../../../lib/supabase';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, url, mobileNumber } = req.body;

    if (!email || !url) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    
    // If user doesn't exist, create a new user with the mobile number
    if (!existingUser) {
      // For magic link registration, we don't have first/last name
      // We'll extract a name from the email if needed
      const emailName = email.split('@')[0];
      
      await createUser({ 
        email,
        name: emailName,
        mobile_number: mobileNumber || null
      });
    } else if (mobileNumber && !existingUser.mobile_number) {
      // If user exists but doesn't have a mobile number, update the user
      const { data, error } = await supabase
        .from('users')
        .update({ mobile_number: mobileNumber })
        .eq('id', existingUser.id);
      
      if (error) {
        console.error('Error updating user mobile number:', error);
      }
    }

    // Configure email transport
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Send the email
    await transport.sendMail({
      to: email,
      from: process.env.EMAIL_FROM || 'noreply@simstudio.com',
      subject: 'Sign in to SimStudio',
      text: `Click the link below to sign in to SimStudio:\n\n${url}\n\n`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <img src="${process.env.NEXTAUTH_URL}/assets/SimStudio Logo Main - Black Bg.png" alt="SimStudio Logo" style="display: block; margin: 0 auto; max-width: 200px;">
          <h1 style="text-align: center; color: #333;">Sign in to SimStudio</h1>
          <p style="text-align: center; margin-bottom: 30px;">Click the button below to sign in to your SimStudio account.</p>
          <div style="text-align: center;">
            <a href="${url}" style="display: inline-block; background-color: #f7c948; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign In</a>
          </div>
          <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
          <p style="text-align: center; color: #666; font-size: 12px;">© ${new Date().getFullYear()} SimStudio. All rights reserved.</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return res.status(500).json({ error: 'Failed to send verification email' });
  }
}
