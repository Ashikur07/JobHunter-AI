// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // --- Basic Info ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  
  // --- Profile Info ---
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  phone: { type: String, default: "" },
  
  links: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    facebook: { type: String, default: "" }
  },

  // --- Verification Info ---
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },

  // --- Telegram Integration (NEW) ---
  telegramChatId: { type: String }, // কানেক্টেড টেলিগ্রাম আইডি
  otp: { type: String },            // ভেরিফিকেশন কোড
  otpExpiry: { type: Date },        // কোডের মেয়াদ

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);