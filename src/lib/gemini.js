import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractJobData({ text, image, url }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let promptParts = [
      `Extract job details from the input and return ONLY a JSON object.
       Do not use Markdown formatting.
       Fields: title, company, location, salary, description (max 2 sentences).
       If missing, set to null.
       Note: If the input is HTML, ignore script tags and focus on visible text.`
    ];

    // ১. যদি লিংক (URL) থাকে -> ZenRows দিয়ে HTML আনবো
    if (url) {
      const zenRowsKey = process.env.ZENROWS_API_KEY;
      if (!zenRowsKey) throw new Error("ZenRows API Key missing");

      // লিংকের স্পেশাল ক্যারেক্টার হ্যান্ডেল করার জন্য encodeURIComponent ব্যবহার করছি
      const proxyUrl = `https://api.zenrows.com/v1/?apikey=${zenRowsKey}&url=${encodeURIComponent(url)}&js_render=true&premium_proxy=true`;
      
      console.log("Fetching URL via ZenRows:", url); // ডিবাগিংয়ের জন্য
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ZenRows Error: ${response.status} - ${errText}`);
      }
      
      const html = await response.text();
      promptParts.push(`HTML Content: ${html}`);
    }
    
    // ২. ছবি হ্যান্ডেল করা
    else if (image) {
      // যদি বেস৬৪ হেডার থাকে (data:image/...) সেটা বাদ দিচ্ছি
      const base64Data = image.includes("base64,") ? image.split(",")[1] : image;
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      };
      promptParts.push(imagePart);
    } 
    
    // ৩. টেক্সট হ্যান্ডেল করা
    else if (text) {
      promptParts.push(text);
    }

    // Gemini কে কল করা
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    let outputText = response.text();

    // ক্লিনআপ
    outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();
    const jobData = JSON.parse(outputText);

    // --- Platform & Link Detection Logic (একই জায়গায়) ---
    if (url) {
      jobData.postLink = url;
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes("linkedin")) jobData.platform = "LinkedIn";
      else if (lowerUrl.includes("bdjobs")) jobData.platform = "BDJobs";
      else if (lowerUrl.includes("glassdoor")) jobData.platform = "Glassdoor";
      else jobData.platform = "Web";
    } else if (image) {
      jobData.platform = "Screenshot";
    } else {
      jobData.platform = "Text Paste";
    }

    return jobData;

  } catch (error) {
    console.error("Gemini/ZenRows Logic Error:", error);
    throw error; // এররটা পাস করে দিচ্ছি যাতে API বুঝতে পারে
  }
}