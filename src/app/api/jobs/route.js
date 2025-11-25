import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; 

// ✅ আপডেট: Absolute Path ব্যবহার করছি যাতে ফাইল খুঁজে পেতে সমস্যা না হয়
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// GET Jobs (Public vs Private)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // ১. পাবলিক রিকোয়েস্ট (Landing Page এর জন্য)
    if (type === 'public') {
      const jobs = await Job.find({})
        .sort({ createdAt: -1 })
        .limit(9) // ডিজাইন সুন্দর রাখতে ৯টা জব দেখাচ্ছি
        .select('title company location createdAt'); // সেন্সিটিভ ডাটা বাদ দিচ্ছি
      
      return NextResponse.json({ success: true, data: jobs });
    }

    // ২. প্রাইভেট রিকোয়েস্ট (Dashboard এর জন্য)
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // শুধু লগ-ইন করা ইউজারের জব খুঁজবে
    const jobs = await Job.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, data: jobs });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Job (Save with User Email)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // লগ-ইন ছাড়া সেভ করতে দেবে না
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const jobData = await request.json();
    
    // ইউজারের ইমেইল সহ নতুন জব তৈরি
    const newJob = await Job.create({
      ...jobData,
      userEmail: session.user.email 
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}