if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose')
const userRouter = require('./routes/user.js')
const resumeRouter = require('./routes/resume.js')
const trackRouter = require('./routes/jobTracker.js')

const app = express();
const upload = multer({ dest: 'uploads/' });

const db_url = process.env.ATLAS_DB_URL

main()
  .then(()=>{
    console.log("Connected to the db successfully!!")
  })
  .catch(()=>{
    console.log("Some error occurred!!")
  })

async function main() {
  await mongoose.connect(db_url);
}

app.use(express.json());
app.use(cors());

app.use('/user',userRouter)
app.use('/resume',resumeRouter)
app.use('/track',trackRouter)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1' // ✅ use v1
});

app.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  const filePath = req.file?.path;

  try {
    const jobDescription = req.body.jobDescription;
    if (!req.file || !jobDescription) {
      return res.status(400).json({ error: 'Resume file and job description are required.' });
    }

    let resumeText = '';

    if (req.file.mimetype === 'application/pdf') {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      resumeText = data.text;
      console.log(resumeText)
      console.log(jobDescription)
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

    // ✅ Use correct model
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // ✅ Clean ```json blocks if present
    const clean = responseText.replace(/```json|```/g, '').trim();

    try {
      const parsed = JSON.parse(clean);
      console.log(parsed)
      res.status(200).json(parsed);
    } catch (err) {
      res.status(500).json({
        error: 'Gemini returned invalid JSON',
        raw: responseText
      });
    }
  } catch (err) {
    console.error('Gemini Error:', err.message);
    res.status(500).json({ error: 'Something went wrong', detail: err.message });
  } finally {
    if (filePath) fs.unlink(filePath, () => {});
  }
});

app.listen(8080, () => {
  console.log('✅ Gemini Resume Screener API running at http://localhost:8080');
});
