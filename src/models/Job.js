// src/models/Job.js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  // Basic Info (AI Extracted)
  title: { type: String, required: [true, 'Please provide a job title'],},
  company: { type: String},
  location: { type: String },
  salary: { type: String },
  description: { type: String },
  
  // Tracking Details
  postLink: { type: String },
  platform: { type: String, default: 'Unknown' }, // LinkedIn, BDJobs
  applicationDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'], 
    default: 'Applied' 
  },

  // Interview & Contact
  interviewDate: { type: Date },
  contactPerson: { type: String }, // HR Name
  contactEmail: { type: String }, // Phone/Email
  
  // Personal Feedback
  salaryExpectation: { type: String },
  feedback: { type: String },
  notes: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);