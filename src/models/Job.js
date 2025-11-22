import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
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
  applyLink: {
    type: String,
  },
  platform: {
    type: String, // e.g., LinkedIn, BDJobs, Glassdoor
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
    default: 'Applied',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);