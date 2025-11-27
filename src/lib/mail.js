// src/lib/mail.js
import nodemailer from "nodemailer";

// ১. ট্রান্সপোর্টার কনফিগারেশন (কমন)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ২. ওয়েবসাইটের ভেরিফিকেশন ইমেইল (আগেরটাই)
export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${domain}/api/auth/verify?token=${token}`;

    const mailOptions = {
      from: `"Job Hunter AI" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "Verify your email address 🕵️‍♂️",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb;">Welcome to Job Hunter AI!</h2>
          <p>Click the button below to verify your email:</p>
          <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
          <p style="color: #888; font-size: 12px;">Link expires in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};

// ৩. টেলিগ্রাম OTP ইমেইল (নতুন ফাংশন) 🤖
export const sendTelegramOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Job Hunter AI Bot" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "Your Telegram Connection Code 🔐",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb;">Connect Telegram Bot</h2>
          <p>Use the code below to connect your Telegram account:</p>
          <h1 style="background-color: #f3f4f6; padding: 10px; letter-spacing: 5px; display: inline-block; border-radius: 5px;">${otp}</h1>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">This code expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("OTP Email Error:", error);
    return false;
  }
};