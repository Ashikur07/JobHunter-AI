import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextResponse } from "next/server";

// ১. ডাটা সেভ করার জন্য (আগেরটাই)
export async function POST(request) {
  try {
    await dbConnect();
    const jobData = await request.json();
    const newJob = await Job.create(jobData);
    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ২. ডাটা নিয়ে আসার জন্য (নতুন যোগ হলো)
export async function GET() {
  try {
    await dbConnect();
    // নতুন জব সবার উপরে দেখাবে (sort by createdAt descending)
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}