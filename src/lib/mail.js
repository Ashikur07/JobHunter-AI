import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  try {
    console.log("Attempting to send email to:", email);
    
    // SMTP কনফিগারেশন লগ (পাসওয়ার্ড বাদে)
    console.log("SMTP Config:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_MAIL,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail", // সরাসরি 'gmail' সার্ভিস ব্যবহার করছি (সহজ অপশন)
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${domain}/api/auth/verify?token=${token}`;

    const mailOptions = {
      from: `"Job Hunter AI" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "Verify your email address 🕵️‍♂️",
      text: `Verify here: ${verifyUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #2563eb;">Welcome to Job Hunter AI!</h2>
          <p>Click the button below to verify your email:</p>
          <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
          <p style="color: #888; font-size: 12px;">If button doesn't work: ${verifyUrl}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    return true;

  } catch (error) {
    console.error("❌ Email Sending Failed:", error);
    return false;
  }
};