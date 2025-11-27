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
  // Try normal account verification token first
  const userByVerify = await User.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (userByVerify) {
    userByVerify.isVerified = true;
    userByVerify.verifyToken = undefined;
    userByVerify.verifyTokenExpiry = undefined;
    await userByVerify.save();
    return NextResponse.redirect(new URL("/signin?verified=true", request.url));
  }

  // If not an account verify token, check for Telegram connect token
  const userByTelegram = await User.findOne({
    telegramVerifyToken: token,
    telegramVerifyExpiry: { $gt: Date.now() },
  });

  if (userByTelegram) {
    // link telegram id from pending field
    if (userByTelegram.telegramPendingChatId) {
      userByTelegram.telegramId = userByTelegram.telegramPendingChatId;
    }
    userByTelegram.telegramVerifyToken = undefined;
    userByTelegram.telegramVerifyExpiry = undefined;
    userByTelegram.telegramPendingChatId = undefined;
    await userByTelegram.save();
    return NextResponse.redirect(new URL("/signin?connected=true", request.url));
  }

  // কোন টোকেনই মিলে না
  return NextResponse.redirect(new URL("/signin?error=InvalidToken", request.url));
}