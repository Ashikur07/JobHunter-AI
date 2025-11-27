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

      // ১. চেক করি ইউজার কানেক্টেড কিনা
      const connectedUser = await User.findOne({ telegramChatId: chatId });

      // --- 🔒 যদি কানেক্টেড না থাকে (GUEST FLOW) ---
      if (!connectedUser) {
        
        // A. START COMMAND (Welcome Message)
        if (text === "/start") {
          const welcomeMsg = `
🤖 **Welcome to JobHunter AI!** 👋

I am your personal assistant to track job applications instantly.

🔴 **Status:** Not Connected
To save jobs, you need to link your website account first.

👇 **How to Connect:**

1️⃣ **Step 1:** Send your email
Type: \`/connect your_email@example.com\`

2️⃣ **Step 2:** Verify OTP
Check your email for a code, then type:
Type: \`/verify 123456\`

-----------------------------
Once connected, just forward any **Job Link** or upload a **Screenshot**, and I will save it to your dashboard! 🚀
          `;
          await bot.sendMessage(chatId, welcomeMsg, { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // B. CONNECT COMMAND
        if (text && text.startsWith("/connect")) {
          const parts = text.split(" ");
          const email = parts[1];
          
          if (!email) {
            await bot.sendMessage(chatId, "⚠️ **Missing Email!**\n\nPlease type your email after the command.\nExample:\n`/connect yourname@gmail.com`", { parse_mode: "Markdown" });
            return NextResponse.json({ success: true });
          }

          const user = await User.findOne({ email: email });
          if (!user) {
            await bot.sendMessage(chatId, "❌ **Account Not Found!**\n\nThis email is not registered on our website.\nPlease register first at our website.", { parse_mode: "Markdown" });
            return NextResponse.json({ success: true });
          }

          // OTP জেনারেট ও সেভ
          const otp = crypto.randomInt(100000, 999999).toString();
          user.otp = otp;
          user.otpExpiry = Date.now() + 10 * 60 * 1000; // ১০ মিনিট
          await user.save();

          // ইমেইল পাঠানো
          await bot.sendMessage(chatId, "⏳ Sending verification code to your email...");
          const emailSent = await sendTelegramOTP(email, otp);
          
          if (emailSent) {
            await bot.sendMessage(chatId, `✅ **OTP Sent!** 📧\n\nPlease check your email (${email}) for the code.\n\nThen type:\n\`/verify <code>\``, { parse_mode: "Markdown" });
          } else {
            await bot.sendMessage(chatId, "❌ Failed to send email. Please try again later.");
          }
          return NextResponse.json({ success: true });
        }

        // C. VERIFY COMMAND
        if (text && text.startsWith("/verify")) {
          const parts = text.split(" ");
          const code = parts[1];
          
          if (!code) {
            await bot.sendMessage(chatId, "⚠️ **Missing Code!**\n\nPlease type the OTP code.\nExample:\n`/verify 123456`", { parse_mode: "Markdown" });
            return NextResponse.json({ success: true });
          }

          const user = await User.findOne({ 
            otp: code, 
            otpExpiry: { $gt: Date.now() } 
          });

          if (!user) {
            await bot.sendMessage(chatId, "❌ **Invalid or Expired Code.**\nPlease try connecting again.");
            return NextResponse.json({ success: true });
          }

          // কানেকশন সফল
          user.telegramChatId = chatId;
          user.otp = undefined;
          user.otpExpiry = undefined;
          await user.save();

          // 🎉 সাকসেস মেসেজ আপডেট করা হয়েছে (কমান্ড লিস্ট সহ)
          const successMsg = `
🎉 **Connected Successfully!**

Welcome, **${user.name}**! 🌟

✅ **You are ready to go!**
Simply forward **Job Links** 🔗 or upload **Screenshots** 📸 here.

👇 **Useful Commands:**
🔹 \`/today\` - View today's saved jobs
🔹 \`/myjobs\` - View last 5 jobs
🔹 \`/me\` - Check profile info
🔹 \`/disconnect\` - Logout from bot

I will organize everything in your dashboard. 🚀
          `;

          await bot.sendMessage(chatId, successMsg, { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // অপরিচিত মেসেজ ওয়ার্নিং
        await bot.sendMessage(chatId, "🔒 **Login Required**\n\nPlease connect your account to start saving jobs.\n\nType: `/connect your@email.com`", { parse_mode: "Markdown" });
        return NextResponse.json({ success: true });
      }

      // --- ✅ কানেক্টেড ইউজারদের জন্য (AUTHENTICATED FLOW) ---
      if (connectedUser) {
        
        // START COMMAND (For logged in users)
        if (text === "/start") {
          const msg = `
👋 **Welcome Back, ${connectedUser.name}!**

You are connected to: \`${connectedUser.email}\`

🟢 **Ready to track!**
Just send me a Link or Screenshot.

📋 **Commands:**
🔹 \`/today\` - Jobs saved today
🔹 \`/myjobs\` - Last 5 jobs
🔹 \`/me\` - Profile info
🔹 \`/disconnect\` - Logout
          `;
          await bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // DISCONNECT
        if (text === "/disconnect") {
          connectedUser.telegramChatId = undefined;
          await connectedUser.save();
          await bot.sendMessage(chatId, "✅ **Disconnected.**\nSee you again! 👋", { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // PROFILE INFO
        if (text === "/me") {
          await bot.sendMessage(chatId, `👤 **Your Profile:**\n\nName: ${connectedUser.name}\nEmail: ${connectedUser.email}\nStatus: 🟢 Connected`, { parse_mode: "Markdown" });
          return NextResponse.json({ success: true });
        }

        // TODAY'S ACTIVITY
        if (text === "/today") {
          const start = new Date();
          start.setHours(0,0,0,0);
          const jobs = await Job.find({ userEmail: connectedUser.email, createdAt: { $gte: start } });
          
          if(jobs.length === 0) {
            await bot.sendMessage(chatId, "📅 No jobs saved today. Keep hunting! 🦁");
          } else {
            let msg = `📅 **Saved Today (${jobs.length}):**\n`;
            jobs.forEach(j => msg += `\n✅ ${j.title} \n   (${j.company})`);
            await bot.sendMessage(chatId, msg);
          }
          return NextResponse.json({ success: true });
        }

        // RECENT JOBS
        if (text === "/myjobs") {
          const jobs = await Job.find({ userEmail: connectedUser.email }).sort({ createdAt: -1 }).limit(5);
          if(jobs.length === 0) {
            await bot.sendMessage(chatId, "📭 Your dashboard is empty.");
          } else {
            let msg = "📋 **Last 5 Jobs:**\n";
            jobs.forEach((j, i) => msg += `\n${i+1}. **${j.title}** \n   🏢 ${j.company} | ${j.status}`);
            await bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
          }
          return NextResponse.json({ success: true });
        }

        // --- JOB SAVING LOGIC ---
        if (photo || (text && !text.startsWith("/"))) {
          await bot.sendMessage(chatId, "🔎 **Analyzing...** Please wait.");
          
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

            if (jobData) {
              const newJob = await Job.create({
                ...jobData,
                userEmail: connectedUser.email
              });
              
              // ⚠️ মেসেজ আপডেট করা হয়েছে (ড্যাশবোর্ড লিংক সহ)
              await bot.sendMessage(chatId, `✅ **Job Saved Successfully!**\n\n📌 **Title:** ${newJob.title}\n🏢 **Company:** ${newJob.company}\n🔗 **Platform:** ${newJob.platform}\n\n[Visit Dashboard ➡️](https://job-hunter-ai-lcq6.vercel.app/dashboard)`, { parse_mode: "Markdown", disable_web_page_preview: true });
            }
          } catch (err) {
            console.error(err);
            await bot.sendMessage(chatId, "⚠️ **Error:** Could not process data. Please try again.");
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