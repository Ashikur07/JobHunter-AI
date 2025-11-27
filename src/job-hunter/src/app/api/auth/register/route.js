// src/app/api/auth/register/route.js
import { sendVerificationEmail } from '../../../lib/mail';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

export const POST = async (req) => {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  const db = await connectToDatabase();
  const existingUser = await db.collection('users').findOne({ email });

  if (existingUser) {
    return new Response(JSON.stringify({ message: 'Email already registered' }), { status: 400 });
  }

  const newUser = new User({ email });
  await newUser.save();

  const token = newUser.generateVerificationToken(); // Assuming this method exists
  const emailSent = await sendVerificationEmail(email, token);

  if (!emailSent) {
    return new Response(JSON.stringify({ message: 'Failed to send verification email' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Verification email sent' }), { status: 200 });
};