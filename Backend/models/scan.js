const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  resume: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume' 
  },
  jobTitle: String,
  jobDescription: String,
  aiResponse: {
    name: {
        type:String,
    },
    email: {
        type:String,
    },
    education: {
        type:String,
    },
    experience: {
        type:String,
    },
    skillsMatched: [String],
    skillsMissing: [String],
    matchScore: {
        type:Number,
        required:true,
        default:0,
    },
    strengths: {
        type:String,
    },
    weaknesses: {
        type:String,
    },
    suggestions: {
        type:String,
    },
    evaluation: {
        type:String,
    },
    formatting: {
        type:String,
    },
  }
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
