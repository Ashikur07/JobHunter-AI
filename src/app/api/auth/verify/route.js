import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // টোকেন না থাকলে লগ-ইন পেজে এররসহ পাঠাবো
  if (!token) {
    return NextResponse.redirect(new URL("/signin?error=TokenMissing", request.url));
  }

  await dbConnect();

  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    // ⚠️ ফিক্স: কালো JSON স্ক্রিন না দেখিয়ে, লগ-ইন পেজে এরর মেসেজসহ পাঠাচ্ছি
    return NextResponse.redirect(new URL("/signin?error=InvalidToken", request.url));
  }

  // ভেরিফাই করা
  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save();

  // সফল হলে লগ-ইন পেজে সাকসেস মেসেজসহ পাঠানো
  return NextResponse.redirect(new URL("/signin?verified=true", request.url));
}