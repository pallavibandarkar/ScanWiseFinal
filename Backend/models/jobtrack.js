const mongoose = require('mongoose');

const jobTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan', 
  },
  jobTitle: {
    type:String,
    required:true,
  },
  companyName: {
    type:String,
    required:true,
  },
  jobDescription: {
    type:String,
    required:true,
  },
  applicationDate: {
    type:Date,
  },
  salary: Number,
  status: {
    type: String,
    enum: [
    'Applied',
    'In Review',
    'Followed Up',
    'Interview Scheduled',
    'Rejected',
    'Offered',
    'Accepted'
  ],
    default: 'Applied',
  },
  interview: {
    type: {
      type: String, 
      default:'Online'
    },
    date: Date,
    email: String,
    meetingLink: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('JobTracker', jobTrackerSchema);
