import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  // --- Basic Info ---
  userEmail: { 
    type: String, 
    required: true, index: true 
  },
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
  },
  company: {
    type: String,
    // required: [true, 'Please provide a company name'],
  },
  location: {
    type: String,
  },
  salary: {
    type: String,
  },
  description: {
    type: String,
  },
  
  // --- Tracking Info ---
  postLink: { // Job Link
    type: String,
  },
  platform: { // LinkedIn, BDJobs etc.
    type: String,
    default: 'Unknown'
  },
  status: { // Current Status
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  applicationDate: { // Koto tarikhe apply korecho
    type: Date,
    default: Date.now,
  },

  // --- NEW FIELDS (Viva/Interview & Notes) ---
  interviewDate: { // Eitai Viva Date hisebe kaj korbe
    type: Date,
  },
  notes: { // Tomar personal note
    type: String,
  },
  salaryExpectation: {
    type: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);