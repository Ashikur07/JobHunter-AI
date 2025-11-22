import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
  try {
    // গুগলের কাছে মডেলের লিস্ট চাইছি
    const modelGeneric = genAI.getGenerativeModel({ model: "gemini-pro" }); 
    // (এখানে model নামটা ম্যাটার করে না, আমরা জাস্ট ক্লায়েন্ট ইনিশিয়েট করছি)
    
    // এই হ্যাকটা দিয়ে আমরা সরাসরি মডেল লিস্ট চেক করবো যদি লাইব্রেরি সাপোর্ট করে, 
    // অথবা আমরা একটা সিম্পল টেস্ট করবো।
    
    // যেহেতু library তে সরাসরি listModels ফাংশন এক্সপোজ করা নেই অনেক ভার্সনে,
    // তাই আমরা 'gemini-1.5-flash' দিয়ে একটা 'Hello' পাঠিয়ে দেখবো রেসপন্স কী আসে।
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    
    return NextResponse.json({ 
      success: true, 
      message: "Gemini 1.5 Flash is working!", 
      data: response.text() 
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      fullError: JSON.stringify(error)
    }, { status: 500 });
  }
}