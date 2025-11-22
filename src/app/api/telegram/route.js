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
      const { chat, text, photo } = body.message;
      const chatId = chat.id;

      // --- ১. ছবি হ্যান্ডেল করা (Screenshot Feature) ---
      if (photo) {
        await bot.sendMessage(chatId, "📸 Analyzing screenshot... Please wait.");
        
        // সবচাইতে ভালো কোয়ালিটির ছবিটা নিচ্ছি
        const fileId = photo[photo.length - 1].file_id;
        
        // টেলিগ্রাম থেকে ছবির লিংক বের করা
        const fileLink = await bot.getFileLink(fileId);
        
        // ছবিটা ডাউনলোড করে Base64 এ কনভার্ট করা (Gemini-র জন্য)
        const response = await fetch(fileLink);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        // আমাদের কমন ফাংশন দিয়ে ডাটা বের করা
        const jobData = await extractJobData({ image: base64Image });
        
        // ডাটাবেসে সেভ
        await dbConnect();
        jobData.platform = "Telegram Screenshot";
        const newJob = await Job.create(jobData);

        await bot.sendMessage(chatId, `✅ **Job Saved from Screenshot!**\n\n📌 **Title:** ${newJob.title}\n🏢 **Company:** ${newJob.company}`, { parse_mode: "Markdown" });
        return NextResponse.json({ success: true });
      }

      // --- ২. কমান্ড হ্যান্ডেল করা (Commands) ---
      if (text) {
        
        // A. Start Command
        if (text === "/start") {
          const welcomeMsg = `👋 **Hello Hunter!**\n\nI can save jobs from Links, Text, or Screenshots.\n\n**Try these commands:**\n/myjobs - See last 5 saved jobs\n/today - See jobs added today`;
          await bot.sendMessage(chatId, welcomeMsg, { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // B. My Jobs Command (Last 5 jobs)
        if (text === "/myjobs") {
          await dbConnect();
          const jobs = await Job.find().sort({ createdAt: -1 }).limit(5);
          
          if (jobs.length === 0) {
            await bot.sendMessage(chatId, "No jobs found. Send me a link to save one!");
          } else {
            let msg = "📋 **Last 5 Jobs:**\n\n";
            jobs.forEach((job, i) => {
              msg += `${i + 1}. **${job.title}**\n   🏢 ${job.company} | ${job.status}\n\n`;
            });
            await bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
          }
          return NextResponse.json({ success: true });
        }

        // C. Today's Jobs Command
        if (text === "/today") {
          await dbConnect();
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0); // আজকের দিন শুরু
          
          const jobs = await Job.find({ createdAt: { $gte: startOfDay } });
          
          if (jobs.length === 0) {
            await bot.sendMessage(chatId, "You haven't applied to any jobs today. Get to work! 💪");
          } else {
            let msg = `📅 **Today's Activity (${jobs.length}):**\n\n`;
            jobs.forEach((job) => {
              msg += `✅ **${job.title}** at ${job.company}\n`;
            });
            await bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
          }
          return NextResponse.json({ success: true });
        }

        // --- ৩. লিংক বা টেক্সট সেভ করা (আগের লজিক) ---
        await bot.sendMessage(chatId, "🔎 Analyzing text/link... Please wait.");
        
        let jobData;
        if (text.startsWith("http")) {
          jobData = await extractJobData({ url: text });
          jobData.postLink = text;
          // Platform detection logic (Simplified here, extractJobData usually handles basic platform)
          if(text.includes('linkedin')) jobData.platform = 'LinkedIn';
          else if(text.includes('bdjobs')) jobData.platform = 'BDJobs';
          else jobData.platform = 'Web Link';
        } else {
          jobData = await extractJobData({ text: text });
          jobData.platform = "Telegram Text";
        }

        if (jobData) {
          await dbConnect();
          const newJob = await Job.create(jobData);
          const reply = `✅ **Job Saved!**\n\n📌 **Title:** ${newJob.title}\n🏢 **Company:** ${newJob.company}\n🔗 **Platform:** ${newJob.platform}`;
          await bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram Error:", error);
    // এরর হলে বট যেন চুপ না থাকে, তাই একটা মেসেজ দিচ্ছি
    // (দ্রুত রেসপন্স না দিলে টেলিগ্রাম আবার রিকোয়েস্ট পাঠায়, তাই try-catch জরুরি)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}