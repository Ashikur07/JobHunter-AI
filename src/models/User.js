import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  
  // প্রোফাইল ইনফো
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  phone: { type: String, default: "" },
  links: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    facebook: { type: String, default: "" }
  },

  // --- TELEGRAM BOT FIELDS (নতুন যোগ করা হলো) ---
  telegramId: { type: String }, // ইউজারের টেলিগ্রাম আইডি
  telegramVerifyCode: { type: String }, // ভেরিফিকেশন কোড (OTP)
  telegramVerifyExpiry: { type: Date }, // কোডের মেয়াদ

  // ওয়েবসাইট ভেরিফিকেশন
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);