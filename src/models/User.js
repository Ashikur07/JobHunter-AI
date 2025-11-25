import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  
  // --- নতুন প্রোফাইল ইনফো ---
  bio: { type: String },
  location: { type: String },
  phone: { type: String },
  links: {
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    facebook: { type: String }
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);