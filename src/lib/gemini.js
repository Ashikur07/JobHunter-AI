import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractJobData({ text, image, url }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    let promptParts = [
      `Extract job details and return ONLY a JSON object. No Markdown.
       Fields: title, company, location, salary, type, description (max 2 sentences).
       If missing, set to null.
       Ignore script tags if HTML.`
    ];

    // ১. যদি লিংক থাকে (ZenRows)
    if (url) {
      const zenRowsKey = process.env.ZENROWS_API_KEY;
      const proxyUrl = `https://api.zenrows.com/v1/?apikey=${zenRowsKey}&url=${encodeURIComponent(url)}&js_render=true`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Failed to fetch URL via ZenRows");
      const html = await response.text();
      promptParts.push(`HTML Content: ${html}`);
    }
    // ২. যদি ছবি থাকে
    else if (image) {
      const imagePart = { inlineData: { data: image, mimeType: "image/png" } };
      promptParts.push(imagePart);
    }
    // ৩. যদি টেক্সট থাকে
    else if (text) {
      promptParts.push(text);
    }

    const result = await model.generateContent(promptParts);
    const response = await result.response;
    let outputText = response.text();
    
    outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(outputText);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}