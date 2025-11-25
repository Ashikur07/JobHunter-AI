import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // পোর্ট নম্বর নিশ্চিত করা
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // ডোমেইন সেট করা (env না পেলে লোকালহোস্ট)
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${domain}/api/auth/verify?token=${token}`;

    const mailOptions = {
      from: `"Job Hunter AI" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "Verify your email address 🕵️‍♂️",
      
      // ⚠️ ফিক্স ১: প্লেইন টেক্সট ভার্সন (যাতে ফাঁকা না দেখায়)
      text: `Welcome to Job Hunter AI! Please verify your email by clicking this link: ${verifyUrl}`,
      
      // ⚠️ ফিক্স ২: HTML ভার্সন (সুন্দর ডিজাইনের জন্য)
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">Welcome to Job Hunter AI!</h2>
          <p style="color: #333; font-size: 16px;">Hi there,</p>
          <p style="color: #555; font-size: 16px;">Thanks for signing up. Please verify your email address to activate your account and start tracking jobs.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Email</a>
          </div>
          
          <p style="color: #888; font-size: 12px; text-align: center;">Link expires in 24 hours.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 10px; text-align: center;">If the button doesn't work, copy this link: <br/> ${verifyUrl}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};