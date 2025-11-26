import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User"; // পাবলিক ফিডে ইউজার ইনফো দেখানোর জন্য
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; 

// ✅ ফিক্স: Absolute Path ব্যবহার করছি যাতে ফাইল খুঁজে পেতে সমস্যা না হয়
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// GET Jobs (Public vs Private)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // ১. পাবলিক রিকোয়েস্ট (Landing Page - Community Activity)
    if (type === 'public') {
      // লেটেস্ট ৯টা জব আনছি
      const jobs = await Job.find({})
        .sort({ createdAt: -1 })
        .limit(9)
        .lean(); // lean() ব্যবহার করলাম যাতে ডাটা মডিফাই করা যায়

      // প্রতিটি জবের জন্য ইউজার ইনফো (নাম, ছবি) খুঁজে বের করা
      const jobsWithUser = await Promise.all(jobs.map(async (job) => {
        // জবের userEmail দিয়ে User টেবিল থেকে তথ্য আনা
        const user = await User.findOne({ email: job.userEmail }).select("name image");
        return {
          ...job,
          applicant: user || { name: "Anonymous", image: null } // ইউজার না পেলে ডিফল্ট
        };
      }));
      
      return NextResponse.json({ success: true, data: jobsWithUser });
    }

    // ২. প্রাইভেট রিকোয়েস্ট (Dashboard - My Jobs)
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // শুধু লগ-ইন করা ইউজারের জব খুঁজবে
    const jobs = await Job.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, data: jobs });

  } catch (error) {
    console.error("GET Job Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Job (Save new job)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // লগ-ইন ছাড়া সেভ করতে দেবে না
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
    console.error("POST Job Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}