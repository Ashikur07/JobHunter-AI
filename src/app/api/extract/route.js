import { NextResponse } from "next/server";
import { extractJobData } from "@/lib/gemini"; // আমাদের কমন ফাইল ইম্পোর্ট করলাম

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, image, url } = body;

    if (!text && !image && !url) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // সরাসরি আমাদের কমন ফাংশন কল করছি
    console.log("Processing extraction request..."); // ডিবাগ লগ
    const jobData = await extractJobData({ text, image, url });

    return NextResponse.json({ success: true, data: jobData });

  } catch (error) {
    console.error("Extract API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}