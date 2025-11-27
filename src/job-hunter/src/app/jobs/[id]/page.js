// src/app/api/telegram/route.js
import { sendVerificationEmail } from '../../../lib/mail';
import { User } from '../../../models/User';

export const handleTelegramBot = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Please provide an email address.');
  }

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('Email not found. Please register first.');
    }

    // Send verification email
    const token = user.generateVerificationToken(); // Assuming this method exists
    const emailSent = await sendVerificationEmail(email, token);

    if (emailSent) {
      return res.status(200).send('Verification email sent! Please check your inbox.');
    } else {
      return res.status(500).send('Failed to send verification email. Please try again later.');
    }
  } catch (error) {
    console.error('Error handling Telegram bot request:', error);
    return res.status(500).send('Internal server error.');
  }
};

// Note: Ensure to set up the necessary routes and middleware to handle incoming requests to this function.