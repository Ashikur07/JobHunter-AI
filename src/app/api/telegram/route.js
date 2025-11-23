import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { extractJobData } from "@/lib/gemini";

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (body.message) {
      const { chat, text } = body.message;
      const chatId = chat.id;

      if (text) {
        // ১. ইউজারকে ওয়েটিং মেসেজ দেওয়া
        await bot.sendMessage(chatId, "🔎 Analyzing your job link/text... Please wait.");

        let jobData;
        
        // ২. চেক করি এটা লিংক কিনা
        if (text.startsWith("http")) {
          // লিংক হলে ZenRows দিয়ে ডাটা আনবে (lib/gemini.js ব্যবহার করে)
          jobData = await extractJobData({ url: text });
          
          // --- নতুন লজিক: লিংক এবং প্ল্যাটফর্ম সেট করা ---
          jobData.postLink = text;
          
          const lowerLink = text.toLowerCase();
          if (lowerLink.includes("linkedin")) jobData.platform = "LinkedIn";
          else if (lowerLink.includes("bdjobs")) jobData.platform = "BDJobs";
          else if (lowerLink.includes("glassdoor")) jobData.platform = "Glassdoor";
          else jobData.platform = "Web (Telegram)";
          
        } else {
          // টেক্সট হলে সরাসরি প্রসেস
          jobData = await extractJobData({ text: text });
          jobData.platform = "Telegram Text";
        }

        if (jobData) {
          // ৩. ডাটাবেসে সেভ করা
          await dbConnect();
          
          const newJob = await Job.create(jobData);

          // ৪. সাকসেস মেসেজ পাঠানো
          const reply = `✅ **Job Saved!**\n\n📌 **Title:** ${newJob.title}\n🏢 **Company:** ${newJob.company}\n🔗 **Platform:** ${newJob.platform}\n\nCheck your dashboard!`;
          await bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });
        }
      } else {
        await bot.sendMessage(chatId, "Send me a Job Link or Description Text!");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}