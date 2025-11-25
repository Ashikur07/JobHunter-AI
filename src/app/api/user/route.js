import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ১. ইউজার ডাটা আপডেট করা (PUT)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const data = await request.json(); // ফ্রন্টএন্ড থেকে ডাটা পাচ্ছি

    // ডাটাবেসে আপডেট করছি
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        bio: data.bio,
        location: data.location,
        phone: data.phone,
        links: data.links // এই লাইনটা জরুরি
      },
      { new: true } // আপডেটেড ডাটা ফেরত দেবে
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ২. ইউজার ডাটা নিয়ে আসা (GET)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}