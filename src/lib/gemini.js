import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractJobData({ text, image, url }) {
  try {
    // ⚠️ ফিক্স: 'gemini-2.0-flash' এর বদলে 'gemini-1.5-flash' ব্যবহার করছি।
    // 1.5-flash এর ফ্রি লিমিট অনেক বেশি।
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let promptParts = [
      `Extract job details and return ONLY a JSON object. No Markdown.
       Fields: title, company, location, salary, description (max 2 sentences).
       If missing, set to null.`
    ];

    // ১. লিংক হ্যান্ডেল করা
    if (url) {
      if (!process.env.ZENROWS_API_KEY) {
        return { 
          title: "Job Link (Pending Analysis)", 
          company: "Unknown", 
          postLink: url,
          description: "ZenRows API Key missing in Vercel.",
          platform: "Web Link"
        };
      }
      
      // ZenRows কনফিগারেশন
      const proxyUrl = `https://api.zenrows.com/v1/?apikey=${process.env.ZENROWS_API_KEY}&url=${encodeURIComponent(url)}&js_render=true&premium_proxy=true`;
      
      try {
        const response = await fetch(proxyUrl);
        if (response.ok) {
          const html = await response.text();
          promptParts.push(`HTML Content: ${html}`);
        } else {
          console.warn("ZenRows fetch failed, trying generic extraction.");
          promptParts.push(`Job Link: ${url}`); // HTML না পেলে শুধু লিংক পাঠাবো
        }
      } catch (err) {
        console.error("ZenRows Error:", err);
        promptParts.push(`Job Link: ${url}`);
      }
    } 
    // ২. ছবি হ্যান্ডেল করা
    else if (image) {
      const base64Data = image.includes("base64,") ? image.split(",")[1] : image;
      promptParts.push({ inlineData: { data: base64Data, mimeType: "image/png" } });
    } 
    // ৩. টেক্সট হ্যান্ডেল করা
    else if (text) {
      promptParts.push(text);
    }

    // AI Request
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    let outputText = response.text();

    // Clean JSON
    outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // JSON Parse
    try {
      const data = JSON.parse(outputText);
      
      // Platform Logic
      if (url) {
        data.postLink = url;
        if(url.includes('linkedin')) data.platform = 'LinkedIn';
        else if(url.includes('bdjobs')) data.platform = 'BDJobs';
        else data.platform = 'Web';
      } else {
        data.platform = image ? 'Screenshot' : 'Telegram Text';
      }
      return data;

    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return {
        title: "Extracted Job (Needs Edit)",
        company: "Unknown",
        description: text ? text.substring(0, 100) : "Failed to parse AI response",
        platform: "Error Fallback"
      };
    }

  } catch (error) {
    console.error("Gemini API Fatal Error:", error);
    // 429 বা অন্য এরর হলেও যেন বট ক্র্যাশ না করে, তাই ম্যানুয়াল ডাটা রিটার্ন করছি
    return {
      title: "Job Saved (AI Busy)",
      company: "Check Later",
      description: "AI Quota Exceeded or Error. Please edit details manually.",
      postLink: url || "",
      platform: "System Backup"
    };
  }
}