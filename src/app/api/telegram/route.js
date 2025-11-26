import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { extractJobData } from "@/lib/gemini";
import { sendTelegramOTP } from "@/lib/mail"; // ইমেইল ফাংশন ইমপোর্ট

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: false });

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (body.message) {
      const { chat, text, photo } = body.message;
      const chatId = chat.id.toString(); // স্ট্রিং করে নিচ্ছি

      await dbConnect();

      // 1. ইউজার ভেরিফাই করা (সে কানেক্টেড কিনা)
      let user = await User.findOne({ telegramId: chatId });

      // --- কমান্ড হ্যান্ডলিং ---

      // A. START COMMAND
      if (text === "/start") {
        if (user) {
          await bot.sendMessage(chatId, `👋 Welcome back, **${user.name}**! Send me a job link or screenshot.`);
        } else {
          await bot.sendMessage(chatId, "👋 Welcome! Please connect your account first.\n\nType: `/connect your@email.com`", { parse_mode: "Markdown" });
        }
        return NextResponse.json({ success: true });
      }

      // B. CONNECT COMMAND (/connect email)
      if (text && text.startsWith("/connect")) {
        const email = text.split(" ")[1];
        if (!email) {
          await bot.sendMessage(chatId, "⚠️ Please provide your email.\nExample: `/connect myemail@gmail.com`", { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // ইমেইল আছে কিনা চেক
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
          await bot.sendMessage(chatId, "❌ This email is not registered on our website. Please sign up first.");
          return NextResponse.json({ success: true });
        }

        // OTP জেনারেট করা (৬ ডিজিট)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // ডাটাবেসে OTP সেভ করা (১০ মিনিট মেয়াদ)
        existingUser.telegramVerifyCode = otp;
        existingUser.telegramVerifyExpiry = Date.now() + 10 * 60 * 1000;
        // chatId টা টেম্পোরারি সেভ করতে পারো অথবা ভেরিফাইয়ের সময় আপডেট করতে পারো।
        // আমরা ভেরিফাইয়ের সময় আপডেট করব।
        await existingUser.save();

        // ইমেইল পাঠানো
        const emailSent = await sendTelegramOTP(email, otp);
        
        if (emailSent) {
          await bot.sendMessage(chatId, `✅ OTP sent to **${email}**.\n\nPlease check your email and type:\n\`/verify ${email} YOUR_CODE\``, { parse_mode: "Markdown" });
        } else {
          await bot.sendMessage(chatId, "❌ Failed to send email. Please try again later.");
        }
        return NextResponse.json({ success: true });
      }

      // C. VERIFY COMMAND (/verify email code)
      if (text && text.startsWith("/verify")) {
        const parts = text.split(" ");
        const email = parts[1];
        const code = parts[2];

        if (!email || !code) {
          await bot.sendMessage(chatId, "⚠️ Invalid format.\nUse: `/verify email code`", { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        const pendingUser = await User.findOne({ 
          email: email,
          telegramVerifyCode: code,
          telegramVerifyExpiry: { $gt: Date.now() }
        });

        if (!pendingUser) {
          await bot.sendMessage(chatId, "❌ Invalid or expired code.");
          return NextResponse.json({ success: true });
        }

        // সফল ভেরিফিকেশন
        pendingUser.telegramId = chatId; // টেলিগ্রাম আইডি লিংক করে দিলাম
        pendingUser.telegramVerifyCode = undefined;
        pendingUser.telegramVerifyExpiry = undefined;
        await pendingUser.save();

        await bot.sendMessage(chatId, "🎉 **Account Connected Successfully!**\nNow you can send me job links or screenshots to save directly to your dashboard.", { parse_mode: "Markdown" });
        return NextResponse.json({ success: true });
      }

      // --- D. JOB SAVING (RESTRICTED) ---
      // যদি ইউজার কানেক্টেড না থাকে, জব সেভ করতে দেব না
      if (!user) {
        // যদি কানেক্ট বা ভেরিফাই কমান্ড না হয়, তাহলে ওয়ার্নিং দাও
        if (!text.startsWith("/connect") && !text.startsWith("/verify")) {
          await bot.sendMessage(chatId, "🔒 **Access Denied!**\nYou need to connect your website account first.\n\nType: `/connect your@email.com`", { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }
      }

      // --- ইউজার কানেক্টেড থাকলে জব সেভ করব ---
      if (user) {
        // ১. ছবি হ্যান্ডেল করা
        if (photo) {
          await bot.sendMessage(chatId, "📸 Processing screenshot for your account...");
          const fileId = photo[photo.length - 1].file_id;
          const fileLink = await bot.getFileLink(fileId);
          const imgRes = await fetch(fileLink);
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const base64Image = buffer.toString("base64");

          const jobData = await extractJobData({ image: base64Image });
          
          // ইউজারের ইমেইল সহ সেভ
          jobData.platform = "Telegram Screenshot";
          jobData.userEmail = user.email; // ইমেইল লিংক করে দিলাম
          
          const newJob = await Job.create(jobData);
          await bot.sendMessage(chatId, `✅ **Saved to Dashboard!**\n📌 ${newJob.title}\n🏢 ${newJob.company}`);
        }

        // ২. লিংক বা টেক্সট হ্যান্ডেল করা
        else if (text && !text.startsWith("/")) {
          await bot.sendMessage(chatId, "🔎 Analyzing...");
          
          let jobData;
          if (text.startsWith("http")) {
             jobData = await extractJobData({ url: text });
          } else {
             jobData = await extractJobData({ text: text });
             jobData.platform = "Telegram Text";
          }

          if (jobData) {
            jobData.userEmail = user.email; // ইমেইল লিংক
            const newJob = await Job.create(jobData);
            await bot.sendMessage(chatId, `✅ **Saved to Dashboard!**\n📌 ${newJob.title}\n🏢 ${newJob.company}`);
          }
        }
        // ৩. অন্য কমান্ড (My Jobs / Today)
        else if (text === "/myjobs") {
           const jobs = await Job.find({ userEmail: user.email }).sort({ createdAt: -1 }).limit(5);
           if (jobs.length === 0) await bot.sendMessage(chatId, "No jobs found.");
           else {
             let msg = "📋 **Your Last 5 Jobs:**\n";
             jobs.forEach((j, i) => msg += `\n${i+1}. ${j.title} \n   (${j.company})`);
             await bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
           }
        }
      }

    }
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Bot Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}