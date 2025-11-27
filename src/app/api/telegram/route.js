// src/app/api/telegram/route.js
import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import { extractJobData } from "@/lib/gemini";
import { sendTelegramOTP } from "@/lib/mail";
import crypto from "crypto";

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: false });

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (body.message) {
      const { chat, text, photo } = body.message;
      const chatId = chat.id.toString();

      await dbConnect();

      // ১. চেক করি এই টেলিগ্রাম আইডি কোনো ইউজারের সাথে কানেক্টেড কিনা
      const connectedUser = await User.findOne({ telegramChatId: chatId });

      // --- 🔒 যদি কানেক্টেড না থাকে (UNAUTHENTICATED FLOW) ---
      if (!connectedUser) {
        
        if (text && text.startsWith("/connect")) {
          // কমান্ড: /connect user@email.com
          const email = text.split(" ")[1];
          
          if (!email) {
            await bot.sendMessage(chatId, "⚠️ Please provide your email.\nExample: `/connect your@email.com`", { parse_mode: "Markdown" });
            return NextResponse.json({ success: true });
          }

          const user = await User.findOne({ email: email });
          if (!user) {
            await bot.sendMessage(chatId, "❌ No account found with this email. Please register on the website first.");
            return NextResponse.json({ success: true });
          }

          // OTP জেনারেট করা
          const otp = crypto.randomInt(100000, 999999).toString();
          user.otp = otp;
          user.otpExpiry = Date.now() + 10 * 60 * 1000; // ১০ মিনিট মেয়াদ
          await user.save();

          // ইমেইল পাঠানো
          const emailSent = await sendTelegramOTP(email, otp);
          
          if (emailSent) {
            await bot.sendMessage(chatId, `✅ OTP sent to ${email}\n\nPlease verify using:\n\`/verify 123456\``, { parse_mode: "Markdown" });
          } else {
            await bot.sendMessage(chatId, "❌ Failed to send email. Please try again later.");
          }
          return NextResponse.json({ success: true });
        }

        if (text && text.startsWith("/verify")) {
          // কমান্ড: /verify 123456
          const code = text.split(" ")[1];
          
          if (!code) {
            await bot.sendMessage(chatId, "⚠️ Please provide the code.\nExample: `/verify 123456`", { parse_mode: "Markdown" });
            return NextResponse.json({ success: true });
          }

          // কোড চেক করা
          const user = await User.findOne({ 
            otp: code, 
            otpExpiry: { $gt: Date.now() } 
          });

          if (!user) {
            await bot.sendMessage(chatId, "❌ Invalid or expired code.");
            return NextResponse.json({ success: true });
          }

          // কানেকশন সফল!
          user.telegramChatId = chatId;
          user.otp = undefined;
          user.otpExpiry = undefined;
          await user.save();

          await bot.sendMessage(chatId, `🎉 **Success!**\nYour Telegram is now connected to **${user.name}**.\n\nYou can now send Links or Screenshots to save jobs!`, { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // অপরিচিত কাউকে ওয়ার্নিং দেওয়া
        await bot.sendMessage(chatId, "🔒 **Access Denied**\n\nPlease connect your Job Hunter account first.\n\nType: `/connect your@email.com`", { parse_mode: "Markdown" });
        return NextResponse.json({ success: true });
      }

      // --- ✅ যদি কানেক্টেড থাকে (AUTHENTICATED FLOW) ---
      if (connectedUser) {
        
        // ডিসকানেক্ট অপশন
        if (text === "/disconnect") {
          connectedUser.telegramChatId = undefined;
          await connectedUser.save();
          await bot.sendMessage(chatId, "Disconnected successfully. Bye! 👋");
          return NextResponse.json({ success: true });
        }

        // প্রোফাইল চেক
        if (text === "/me") {
          await bot.sendMessage(chatId, `👤 **Connected As:**\nName: ${connectedUser.name}\nEmail: ${connectedUser.email}`, { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // --- জব প্রসেসিং (আগের লজিক + ইউজার ইমেইল) ---
        if (photo || (text && !text.startsWith("/"))) {
          await bot.sendMessage(chatId, "🔎 Analyzing... Please wait.");
          
          try {
            let jobData = {};
            
            if (photo) {
              const fileId = photo[photo.length - 1].file_id;
              const fileLink = await bot.getFileLink(fileId);
              const imgRes = await fetch(fileLink);
              const arrayBuffer = await imgRes.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const base64Image = buffer.toString("base64");
              
              jobData = await extractJobData({ image: base64Image });
              jobData.platform = "Telegram Screenshot";
            } 
            else if (text.startsWith("http")) {
              jobData = await extractJobData({ url: text });
            } 
            else {
              jobData = await extractJobData({ text: text });
              jobData.platform = "Telegram Text";
            }

            // ⚠️ মেইন কাজ: ইউজারের ইমেইল যোগ করা
            if (jobData) {
              const newJob = await Job.create({
                ...jobData,
                userEmail: connectedUser.email // এই জবের মালিক এই ইউজার
              });
              
              await bot.sendMessage(chatId, `✅ **Job Saved!**\n\n📌 ${newJob.title}\n🏢 ${newJob.company}\n📂 Saved to: ${connectedUser.email}`, { parse_mode: "Markdown" });
            }
          } catch (err) {
            console.error(err);
            await bot.sendMessage(chatId, "⚠️ Error processing job. Please try again.");
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}