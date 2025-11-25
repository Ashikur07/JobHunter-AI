import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  
  // --- নতুন ফিল্ডগুলো অবশ্যই থাকতে হবে ---
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  phone: { type: String, default: "" },
  
  // লিংকগুলো একটা অবজেক্টের ভেতর থাকবে
  links: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    facebook: { type: String, default: "" }
  },

  // ভেরিফিকেশন ফিল্ডস
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);