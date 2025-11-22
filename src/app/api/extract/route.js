import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    // আমরা এখন text, image, অথবা url রিসিভ করতে পারি
    const { text, image, url } = await request.json();

    if (!text && !image && !url) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // মডেল সেটআপ (তোমার লেটেস্ট মডেল)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let promptParts = [
      `Extract job details from the input and return ONLY a JSON object.
       Do not use Markdown formatting.
       Fields: title, company, location, salary, type, description (max 2 sentences).
       If missing, set to null.
       Note: If the input is HTML, ignore script tags and focus on visible text.`
    ];

    // ১. যদি লিংক (URL) থাকে -> ZenRows দিয়ে HTML আনবো
    if (url) {
      const zenRowsKey = process.env.ZENROWS_API_KEY;
      // ZenRows এর মাধ্যমে রিকোয়েস্ট পাঠাচ্ছি
      const proxyUrl = `https://api.zenrows.com/v1/?apikey=${zenRowsKey}&url=${encodeURIComponent(url)}&js_render=true`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch URL content via ZenRows");
      }
      
      const html = await response.text();
      // পুরো HTML Gemini-কে দিয়ে দিচ্ছি (Flash মডেল অনেক বড় ডাটা নিতে পারে)
      promptParts.push(`HTML Content of the job page: ${html}`);
    }
    
    // ২. যদি ছবি (Image) থাকে
    else if (image) {
      const imagePart = {
        inlineData: {
          data: image.split(",")[1],
          mimeType: "image/png",
        },
      };
      promptParts.push(imagePart);
    } 
    
    // ৩. যদি টেক্সট (Text) থাকে
    else if (text) {
      promptParts.push(text);
    }

    // AI প্রসেসিং
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