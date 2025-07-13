import React from "react";
import './Home.css'
import { assests } from "../../assets/assests";
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsightsIcon from '@mui/icons-material/Insights';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BarChartIcon from '@mui/icons-material/BarChart';
import HistoryIcon from '@mui/icons-material/History';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { useNavigate } from "react-router";

export default function Home(){
  const navigate = useNavigate()
    return(
        <> 
            <section className="hero-section">
                <div className="text-content">
                    <h1>Optimize your resume to get more interviews</h1>
                    <p>ScanWise helps you tailor your resume to any job by identifying key skills and improving your match rate.</p>
                    <Button variant="contained" onClick={()=>{navigate('/dashboard')}}>Start Scanning</Button>
                </div>
                <div className="image-or-upload">
                    <img src={assests.resume} alt="Resume Optimization" />
                </div>
            </section>
            <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <CloudUploadIcon fontSize="large" color="primary" />
            <h4>Upload Resume</h4>
            <p>Select and upload your resume (PDF/DOCX).</p>
          </div>
          <div className="step">
            <InsightsIcon fontSize="large" color="primary" />
            <h4>Paste Job Description</h4>
            <p>Paste a job description or search by role.</p>
          </div>
          <div className="step">
            <CheckCircleIcon fontSize="large" color="primary" />
            <h4>Get Match Score</h4>
            <p>Instantly view skills match and resume tips.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Use ScanWise?</h2>
        <ul>
          <li><AutoAwesomeIcon color="primary" /> AI-powered resume matching</li>
          <li><BarChartIcon color="primary" /> Detailed skill gap analysis</li>
          <li><HistoryIcon color="primary" /> Resume scan history</li>
        </ul>
      </section>

      {/* Call to Action */}
      {/* <section className="call-to-action">
        <h3>Ready to land your dream job?</h3>
        <Button variant="contained" color="primary">Start Scanning Now</Button>
      </section> */}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span><strong>ScanWise</strong> — Resume screening made smarter with AI.</span>
          <span>© 2025 ScanWise. All rights reserved.</span>
        </div>
      </footer>

      
      </>
    )
}