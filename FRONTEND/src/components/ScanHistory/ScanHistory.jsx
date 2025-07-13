import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import './ScanHistory.css';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
export default function ScanHistory({isSidebarOpen}) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8080/resume/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setScans(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error('Failed to fetch scan history:', err);
        setError('Failed to fetch scan history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box className="scan-history-page">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="scan-history-page">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <div>
    <Sidebar isSidebarOpen={isSidebarOpen}/>
    <Box className={`scan-history-page ${isSidebarOpen ? 'opened' : 'change'}`}>
      <Box className="page-header">
        <Typography variant="h4" className="history-title">
          Scan History
        </Typography>
        <Typography variant="body1" className="history-subtitle">
          View your previous resume scans and their analysis results
        </Typography>
      </Box>

      {scans.length === 0 ? (
        <Paper className="empty-state">
          <Box textAlign="center" py={8}>
            <DescriptionIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No scan history found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by uploading your resume to see scan results here
            </Typography>
          </Box>
        </Paper>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table className="scan-table">
            <TableHead>
              <TableRow className="table-header">
                <TableCell className="header-cell">Job Title</TableCell>
                <TableCell className="header-cell" align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <CalendarIcon fontSize="small" />
                    Scan Date
                  </Box>
                </TableCell>
                <TableCell className="header-cell" align="center">Match Score</TableCell>
                <TableCell className="header-cell" align="center">Actions</TableCell>
                <TableCell className="header-cell" align="center">Track</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scans.map((scan, index) => (
                <TableRow 
                  key={scan._id} 
                  className={`table-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}`}
                >
                  <TableCell className="job-title-cell">
                    <Typography variant="body1" fontWeight={600}>
                      {scan.jobTitle}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center" className="date-cell">
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(scan.createdAt)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center" className="score-cell">
                    <Chip
                      label={`${scan.aiResponse.matchScore}%`}
                      color={getScoreColor(scan.aiResponse.matchScore)}
                      variant="filled"
                      className="score-chip"
                    />
                  </TableCell>
                  
                  <TableCell align="center" className="actions-cell">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/report/${scan._id}`)}
                        className="action-button primary-button"
                      >
                        Report
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DescriptionIcon />}
                        href={scan.resume.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button secondary-button"
                      >
                        Resume
                      </Button>
                      
                      {/* <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DescriptionIcon />}
                        href={scan.resume.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button secondary-button"
                        onClick={()=>navigate(`/EditJobdetails/:id`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DescriptionIcon />}
                        href={scan.resume.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button secondary-button"
                      >
                        Delete
                      </Button> */}
                    </Box>
                  </TableCell>
                  <TableCell align="center" className="score-cell">
                    <Button startIcon={<WorkIcon/>}size="small" onClick={()=>navigate('/jobtracker')}></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    </div>
  );
}