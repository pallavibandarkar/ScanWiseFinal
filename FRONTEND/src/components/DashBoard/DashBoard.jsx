import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import './DashBoard.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Sidebar from '../Sidebar/Sidebar';

export default function Dashboard({ isSidebarOpen }) {
  const { user ,BASE_URL} = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) return;
    setLoading(true); 
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    formData.append('userId', user.id); 
    formData.append('jobTitle', jobTitle);

    try {
      const res = await axios.post(`${BASE_URL}/resume/analyze-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Resume Analyzed!");
      const scanId = res.data.scanId;
      navigate(`/report/${scanId}`);
      setResumeFile(null);
      setJobTitle('');
      setJobDescription('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/resume/recentScans/${user.id}`);
        setRecentScans(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecent();
  }, [user.id]);

  return (
    <>
    <div className="dashboard-container">
      <Sidebar isSidebarOpen={isSidebarOpen}/>
      <div className={`main-content ${isSidebarOpen ? 'opened' : 'change'}`}>
        <div className="topbar">
          <h3>Welcome, {user.email}</h3>
        </div>
        <div className="recent-scans-section">
          <h4 className="recent-scans-title">
            <HistoryIcon style={{ color: "#2563eb", marginRight: 8, verticalAlign: "middle" }} />
            Recent Scans
          </h4>
          <div className="scan-cards">
            {recentScans.map((scan) => (
              <div key={scan._id} className="scan-card">
                <div className="scan-card-row">
                  <WorkIcon className="scan-card-icon" />
                  <span><strong>Job Title:</strong> {scan.jobTitle}</span>
                </div>
                <div className="scan-card-row">
                  <BarChartIcon className="scan-card-icon" />
                  <span><strong>Score:</strong> {scan.aiResponse.matchScore}%</span>
                </div>
                <div className="scan-card-row">
                  <AutoAwesomeIcon className="scan-card-icon" />
                  <span><strong>Strengths:</strong> {scan.aiResponse.strengths.slice(0, 50)}...</span>
                </div>
                <a href={scan.resume?.file?.url} target="_blank" rel="noopener noreferrer" className="scan-card-link">
                  View Resume
                </a>
              </div>
            ))}
            {recentScans.length === 0 && <p className="no-scans-msg">No scans yet.</p>}
          </div>
        </div>

        <div className="content-area">
          <h2>This is your dashboard</h2>
          <form
            id="newscan"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="dashboard-form"
          >
            <h3 className="form-title">
              Upload Resume & Job Description
            </h3>

            <label className="form-label">
              <span className="icon-circle">
                <UploadFileIcon />
              </span>
              <input
                type="file"
                name="resume"
                accept=".pdf,.docx"
                required
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="form-input"
              />
            </label>

            <label className="form-label">
              <span className="icon-circle">
                <WorkIcon />
              </span>
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title (e.g., Frontend Developer)"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="form-input"
              />
            </label>

            <label className="form-label">
              <span className="icon-circle">
                <DescriptionIcon />
              </span>
              <textarea
                name="jobDescription"
                rows="6"
                placeholder="Paste job description here"
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="form-textarea"
              />
            </label>

            <button type="submit" className="form-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                <>
                  <UploadFileIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Analyze Resume
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
    </>
  );
}
