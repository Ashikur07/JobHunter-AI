// src/app/api/auth/verify/route.js
import { NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/mongodb'; // Assuming a function to verify the token in the database

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Token is required.' }, { status: 400 });
  }

  try {
    const user = await verifyEmailToken(token); // Verify the token and get user info

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
    }

    // Here you can activate the bot for the user or perform any other actions needed
    // For example, updating the user's status in the database

    return NextResponse.json({ message: 'Email verified successfully! You can now log in.' }, { status: 200 });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ message: 'An error occurred during verification.' }, { status: 500 });
  }
}