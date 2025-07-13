const express = require('express')
const router = express.Router();
const User = require('../models/user.js');
const Scan = require('../models/scan.js');
const Resume = require('../models/resume.js');
const isLoggedIn = require('../middleware.js')
const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const { storage } = require('../cloudConfig.js')
const upload = multer({storage})
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1'
});
const axios = require('axios');


router.post('/analyze-resume',upload.single('resume'),async (req, res) => {
  const filePath = req.file?.path;
  
  try {
    const jobDescription = req.body.jobDescription;
    const userId = req.body.userId;
    if (!req.file || !jobDescription) {
      return res.status(400).json({ error: 'Resume file and job description are required.' });
    }

    let resumeText = '';

    if (req.file.mimetype === 'application/pdf') {
      let buffer;
      if (filePath.startsWith('http')) {
        // Download from Cloudinary
        const response = await axios.get(filePath, { responseType: 'arraybuffer' });
        buffer = Buffer.from(response.data, 'binary');
      } else {
        buffer = fs.readFileSync(filePath);
      }
      const data = await pdfParse(buffer);
      resumeText = data.text;
      console.log(resumeText);
      console.log(jobDescription);
    } else if (
      req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      resumeText = result.value;
    } else {
      fs.unlink(filePath, () => {});
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const prompt = `
Compare the following resume and job description. Return a response strictly in JSON format with the following keys:

{
  "name": "",
  "email": "",
  "education": "",
  "experience": "",
  "skillsMatched": [],
  "skillsMissing": [],
  "matchScore": 0,
  "strengths": "",
  "weaknesses": "",
  "suggestions": "",
  "evaluation": "",
  "formatting":"",
  }

Resume:
${resumeText}

Job Description:
${jobDescription}
`;
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const geminiRes = await model.generateContent(prompt);
    const responseText = geminiRes.response.text();
    const clean = responseText.replace(/```json|```/g, '').trim();

    let aiFeedback;
    try {
      aiFeedback = JSON.parse(clean);
    } catch (err) {
      return res.status(500).json({ error: 'Gemini returned invalid JSON', raw: responseText });
    }

    
    const resumeDoc = await Resume.create({
      user: userId,
      file: {
        url: req.file.path || req.file.url, // Use path or url from multer/cloudinary
        filename: req.file.originalname || req.file.filename,
      },
      textContent: resumeText
    });

   
    const scanDoc = await Scan.create({
      user: userId,
      resume: resumeDoc._id,
      jobTitle: req.body.jobTitle || '',
      jobDescription,
      aiResponse: aiFeedback
    });
    
    console.log("Scan Doc "+scanDoc);
    console.log("Resume doc"+resumeDoc)

    res.status(200).json({ msg: "Resume analyzed and stored", aiResponse: aiFeedback ,scanId:scanDoc._id });
  } catch (err) {
    console.error('Gemini Error:', err.message);
    res.status(500).json({ error: 'Something went wrong', detail: err.message });
  } finally {
    if (filePath) fs.unlink(filePath, () => {});
  }
})


router.get('/recentScans/:userId', async (req, res) => {
  try {
    const recentScans = await Scan.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('resume', 'file');

    res.status(200).json(recentScans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recent scans' });
  }
});


router.get('/scans/:scanId', async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.scanId).populate('resume');
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    res.status(200).json({data:scan , msg:"Report Genereted"});
  } catch (err) {
    res.status(500).json({ error: 'Error fetching scan' });
  }
});

router.get('/history', isLoggedIn, async (req, res) => {
  
  try {
    console.log(req.user)
    const scans = await Scan.find({ user: req.user.userId}).populate('resume');
    console.log(scans)
    res.status(200).json({ data: scans , msg:"History Found" });
  } catch (err) {
    console.error('Error fetching history:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
