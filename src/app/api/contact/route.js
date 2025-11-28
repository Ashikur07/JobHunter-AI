import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // ১. ডাটা ভ্যালিডেশন
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // ২. ট্রান্সপোর্টার সেটআপ (তোমার আগের কনফিগারেশন অনুযায়ী)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, 
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // ৩. মেইল অপশন (তোমার নিজের কাছে মেইল আসবে)
    const mailOptions = {
      from: `"Job Hunter Contact" <${process.env.SMTP_MAIL}>`, // অ্যাপ থেকে মেইল যাবে
      to: process.env.SMTP_MAIL, // তোমার ইমেইলে রিসিভ হবে
      replyTo: email, // ইউজার এর ইমেইলে রিপ্লাই যাবে
      subject: `📩 New Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; color: #555;">${message}</p>
        </div>
      `,
    };

    // ৪. মেইল পাঠানো
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully!" });

  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}