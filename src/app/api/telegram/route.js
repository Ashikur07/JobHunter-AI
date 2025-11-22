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
    
    // টেলিগ্রামের মেসেজ চেক করা
    if (body.message) {
      const { chat, text } = body.message;
      const chatId = chat.id;

      // ১. টেক্সট বা লিংক হ্যান্ডেল করা
      if (text) {
        // ইউজারকে বলি অপেক্ষা করতে
        await bot.sendMessage(chatId, "🔎 Analyzing your job link/text... Please wait.");

        let jobData;
        // চেক করি এটা লিংক কিনা
        if (text.startsWith("http")) {
          jobData = await extractJobData({ url: text });
        } else {
          jobData = await extractJobData({ text: text });
        }

        if (jobData) {
          // ২. ডাটাবেসে সেভ করা (Telegram ID সহ)
          await dbConnect();
          
          // ফিউচার প্ল্যানের জন্য telegramId সেভ রাখছি
          const newJob = await Job.create({
            ...jobData,
            platform: "Telegram Bot",
            // userEmail: "future@email.com" (পরে এখানে রিয়েল ইমেইল আসবে)
            // telegramId: chatId (তুমি চাইলে মডেলে এই ফিল্ড অ্যাড করতে পারো)
          });

          // ৩. সাকসেস মেসেজ
          const reply = `✅ **Job Saved Successfully!**\n\n📌 **Title:** ${newJob.title}\n🏢 **Company:** ${newJob.company}\n💰 **Salary:** ${newJob.salary || "N/A"}\n\nCheck your dashboard!`;
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