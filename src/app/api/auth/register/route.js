import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    await dbConnect();

    // ১. চেক করি ইউজার আছে কিনা
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists!" }, { status: 400 });
    }

    // ২. পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৩. ভেরিফিকেশন টোকেন জেনারেট করা
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = Date.now() + 24 * 3600 * 1000; // ২৪ ঘণ্টা মেয়াদ

    // ৪. ইউজার সেভ করা
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry,
      isVerified: false, // শুরুতে ভেরিফাইড না
    });

    // ৫. ইমেইল পাঠানো
    await sendVerificationEmail(email, verifyToken);

    return NextResponse.json({ success: true, message: "Registration successful! Please check your email." });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}