// src/app/api/telegram/route.js
import { sendVerificationEmail } from '../../../lib/mail';
import { User } from '../../../models/User';

export const handleTelegramBot = async (req, res) => {
  const { email } = req.body;

  if (req.method === 'POST') {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }

      // Check if the email exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Email not found. Please register first.' });
      }

      // Send verification email
      const token = user.generateVerificationToken(); // Assuming a method to generate a token
      const emailSent = await sendVerificationEmail(email, token);

      if (emailSent) {
        return res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
      } else {
        return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
      }
    } catch (error) {
      console.error('Error handling Telegram bot request:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};