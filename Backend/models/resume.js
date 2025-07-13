const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  file:{
    url:String,
    filename:String,
  },
  textContent: String, 
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
