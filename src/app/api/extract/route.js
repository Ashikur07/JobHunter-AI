import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    // আমরা এখন text অথবা image (base64) দুটোই রিসিভ করতে পারি
    const { text, image } = await request.json();

    if (!text && !image) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // আমাদের সেই সুপার ফাস্ট মডেল
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // প্রম্পট তৈরি করা
    let promptParts = [
      `Extract job details from the input (text or image) and return ONLY a JSON object.
       Do not use Markdown formatting.
       Fields: title, company, location, salary, type, description (max 2 sentences).
       If missing, set to null.`
    ];

    // যদি ছবি থাকে, সেটা প্রসেস করো
    if (image) {
      // ছবিটা Base64 ফরম্যাটে আসছে, সেটা Gemini-র বোধ্যগম্য করছি
      const imagePart = {
        inlineData: {
          data: image.split(",")[1], // "data:image/png;base64," অংশটা বাদ দিচ্ছি
          mimeType: "image/png",
        },
      };
      promptParts.push(imagePart);
    } 
    // যদি টেক্সট থাকে
    else if (text) {
      promptParts.push(text);
    }

    const result = await model.generateContent(promptParts);
    const response = await result.response;
    let outputText = response.text();

    // ক্লিনআপ
    outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();
    const jobData = JSON.parse(outputText);

    return NextResponse.json({ success: true, data: jobData });

  } catch (error) {
    console.error("Error extracting data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}