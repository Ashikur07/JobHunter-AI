// src/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Add any middleware logic here, such as authentication checks or logging

  // Example: Redirect to login if the user is not authenticated
  const isAuthenticated = req.cookies.get('auth_token'); // Example cookie check
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}