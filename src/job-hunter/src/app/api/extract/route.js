// src/app/api/extract/route.js
import { sendVerificationEmail } from '../../../lib/mail';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

export const POST = async (req) => {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required.' }), { status: 400 });
  }

  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return new Response(JSON.stringify({ message: 'Email not found. Please register first.' }), { status: 404 });
  }

  const token = generateToken(); // Implement token generation logic
  const emailSent = await sendVerificationEmail(email, token);

  if (!emailSent) {
    return new Response(JSON.stringify({ message: 'Failed to send verification email.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Verification email sent. Please check your inbox.' }), { status: 200 });
};

const generateToken = () => {
  // Implement your token generation logic here
  return 'some-generated-token'; // Placeholder
};