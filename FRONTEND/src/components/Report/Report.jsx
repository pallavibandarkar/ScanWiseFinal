import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import StarIcon from '@mui/icons-material/Star';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {Typography,Grid,Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Sidebar from '../Sidebar/Sidebar';

export default function Report({isSidebarOpen}) {
  const { scanId } = useParams();
  const [scan, setScan] = useState(null);
  const navigate = useNavigate();
  const { BASE_URL } = useAuth()

  const handleTrackClick = () => {
    const trackData = {
        jobTitle: scan.jobTitle,
        scanId:scan._id,
        jobDescription: scan.jobDescription,
        name: scan.aiResponse.name,
        email: scan.aiResponse.email
    };
    console.log(trackData)
    localStorage.setItem('jobTrackDraft', JSON.stringify(trackData));
    navigate('/scanwise/jobtracker');
   };
  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/resume/scans/${scanId}`);
        console.log(res.data.data)
        setScan(res.data.data);
      } catch (err) {
        console.error('Failed to fetch report:', err);
      }
    };
    fetchScan();
  }, [scanId]);

  if (!scan) return <div className="report-loading">Loading report...</div>;

  return (
    <div>
    <Sidebar isSidebarOpen={isSidebarOpen}/>
    
    <div className={`report ${isSidebarOpen ? 'opened' : 'change'}`}>
        <Button className="print-btn" variant="contained" onClick={() => window.print()}>
            Print Report
        </Button>
        <Button className="print-btn" variant="contained" onClick={() => handleTrackClick()}>
            Add to track
        </Button>
    <div className="report-container">
      <div className="report-header">
        <AssessmentIcon className="report-main-icon" />
        <h2>Resume Match Report</h2>
        <span className="report-score">
          <StarIcon style={{ color: "#fbbf24", verticalAlign: "middle" }} />
          {scan.aiResponse.matchScore}%
        </span>
      </div>
      <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Name:</strong> {scan.aiResponse.name}</Typography>
            <Typography><strong>Email:</strong> {scan.aiResponse.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Job Title:</strong> {scan.jobTitle}</Typography>
            <Typography><strong>Date:</strong> {new Date(scan.createdAt).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      <div className="report-section">
        <p><strong>Job Title:</strong> {scan.jobTitle}</p>
        <p><CheckCircleIcon className="report-icon green" /> <strong>Strengths:</strong> {scan.aiResponse.strengths}</p>
        <p><HighlightOffIcon className="report-icon red" /> <strong>Weaknesses:</strong> {scan.aiResponse.weaknesses}</p>
        <p><TipsAndUpdatesIcon className="report-icon yellow" /> <strong>Suggestions:</strong> {scan.aiResponse.suggestions}</p>
        <p><AssessmentIcon className="report-icon blue" /> <strong>Evaluation:</strong> {scan.aiResponse.evaluation}</p>
        <p><FormatAlignLeftIcon className="report-icon blue" /> <strong>Formatting:</strong> {scan.aiResponse.formatting}</p>
        <p><CheckCircleIcon className="report-icon green" /> <strong>Matched Skills:</strong> {scan.aiResponse.skillsMatched.join(' , ')}</p>
        <p><WarningAmberIcon className="report-icon orange" /> <strong>Missing Skills:</strong> {scan.aiResponse.skillsMissing.join(' , ')}</p>
      </div>
    </div>
    </div>
    </div>
  );
}
