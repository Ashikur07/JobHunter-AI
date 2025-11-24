import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { extractJobData } from "@/lib/gemini";

const token = process.env.TELEGRAM_BOT_TOKEN;

// ⚠️ ফিক্স: polling: false দেওয়া বাধ্যতামূলক Vercel এর জন্য
const bot = new TelegramBot(token, { polling: false });

export async function POST(request) {
  try {
    const body = await request.json();
    
    // শুধু মেসেজ থাকলে প্রসেস করব (Edit বা অন্য কিছু না)
    if (body.message) {
      const { chat, text, photo } = body.message;
      const chatId = chat.id;

      try {
        // --- ১. ছবি (Screenshot) হ্যান্ডেল করা ---
        if (photo) {
          await bot.sendMessage(chatId, "📸 Analyzing screenshot... This may take a few seconds.");
          
          // সবচেয়ে ক্লিয়ার ছবিটা নিলাম
          const fileId = photo[photo.length - 1].file_id;
          const fileLink = await bot.getFileLink(fileId);
          
          // ছবি ডাউনলোড করে Base64 করা
          const imgRes = await fetch(fileLink);
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString("base64");

          // Gemini দিয়ে ডাটা বের করা
          const jobData = await extractJobData({ image: base64Image });
          
          // সেভ করা
          await dbConnect();
          jobData.platform = "Telegram Screenshot";
          const newJob = await Job.create(jobData);

          await bot.sendMessage(chatId, `✅ **Saved from Screenshot!**\n\n📌 Title: ${newJob.title}\n🏢 Company: ${newJob.company}`);
          return NextResponse.json({ success: true });
        }

        // --- ২. কমান্ড হ্যান্ডেল করা ---
        if (text) {
          if (text === "/start") {
            await bot.sendMessage(chatId, "👋 Welcome! Send me a Job Link, Text, or Screenshot to save it.");
            return NextResponse.json({ success: true });
          }

          if (text === "/myjobs") {
            await dbConnect();
            const jobs = await Job.find().sort({ createdAt: -1 }).limit(5);
            if (jobs.length === 0) {
              await bot.sendMessage(chatId, "No jobs saved yet.");
            } else {
              let msg = "📋 **Last 5 Jobs:**\n";
              jobs.forEach((job, i) => msg += `\n${i+1}. ${job.title} \n   (${job.company})`);
              await bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
            }
            return NextResponse.json({ success: true });
          }

          if (text === "/today") {
            await dbConnect();
            const start = new Date();
            start.setHours(0,0,0,0);
            const jobs = await Job.find({ createdAt: { $gte: start } });
            await bot.sendMessage(chatId, `📅 You saved **${jobs.length}** jobs today.`);
            return NextResponse.json({ success: true });
          }

          // --- ৩. লিংক বা টেক্সট হ্যান্ডেল করা ---
          await bot.sendMessage(chatId, "🔎 Analyzing... Please wait.");
          
          let jobData;
          if (text.startsWith("http")) {
             jobData = await extractJobData({ url: text });
          } else {
             jobData = await extractJobData({ text: text });
             jobData.platform = "Telegram Text";
          }

          if (jobData) {
            await dbConnect();
            const newJob = await Job.create(jobData);
            await bot.sendMessage(chatId, `✅ **Job Saved!**\n\n📌 ${newJob.title}\n🏢 ${newJob.company}`);
          }
        }

      } catch (innerError) {
        console.error("Processing Error:", innerError);
        // ইউজারকে জানানো যে সমস্যা হয়েছে
        await bot.sendMessage(chatId, "⚠️ Error processing your request. Please try again.");
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Telegram API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}