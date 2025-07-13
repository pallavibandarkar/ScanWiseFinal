import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  Typography, 
  Box, 
  Button, 
  Container,
  Chip,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Grid,
  Divider
} from '@mui/material';
import {
  Work,
  Business,
  CalendarToday,
  AttachMoney,
  VideoCall,
  Edit,
  PendingActions
} from '@mui/icons-material';
import './JobTrackHistory.css';

import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';

export default function JobTrackHistory({ isSidebarOpen }) {
  const [entries, setEntries] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/track/user/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data.data);
    };
    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'primary';
      case 'interview': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return <PendingActions />;
      case 'interview': return <VideoCall />;
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return <Work />;
    }
  };

  return (
    <div className="page-layout">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <Container maxWidth="xl" className="content-container">
          {/* Header */}
          <Box className="page-header">
            <Typography variant="h4" className="page-title">
              Job Application History
            </Typography>
            <Typography variant="subtitle1" className="page-subtitle">
              Track your career journey and application progress
            </Typography>
          </Box>

          {/* Stats */}
          {/* <Box className="stats-grid">
            <Box className="stat-card">
              <Typography variant="h3" className="stat-number">
                {entries.length}
              </Typography>
              <Typography variant="body2" className="stat-label">
                Total Applications
              </Typography>
            </Box>
            <Box className="stat-card">
              <Typography variant="h3" className="stat-number">
                {entries.filter(entry => entry.status?.toLowerCase() === 'interview').length}
              </Typography>
              <Typography variant="body2" className="stat-label">
                Interviews
              </Typography>
            </Box>
            <Box className="stat-card">
              <Typography variant="h3" className="stat-number">
                {entries.filter(entry => entry.status?.toLowerCase() === 'accepted').length}
              </Typography>
              <Typography variant="body2" className="stat-label">
                Accepted
              </Typography>
            </Box>
          </Box> */}

          {/* Content */}
          {entries.length === 0 ? (
            <Card className="empty-state">
              <CardContent className="empty-content">
                <Avatar className="empty-avatar">
                  <Work />
                </Avatar>
                <Typography variant="h5" className="empty-title">
                  No Applications Yet
                </Typography>
                <Typography variant="body1" className="empty-text">
                  Start tracking your job applications to see your progress here.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/add-application')}
                  sx={{ mt: 2 }}
                >
                  Add Your First Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3} className="jobs-grid">
              {entries.map((entry) => (
                <Grid item xs={12} md={6} lg={4} key={entry._id}>
                  <Card className="job-card">
                    <CardContent className="job-content">
                      {/* Status */}
                      <Box className="job-header">
                        <Chip 
                          icon={getStatusIcon(entry.status)}
                          label={entry.status}
                          color={getStatusColor(entry.status)}
                          size="small"
                          className="status-chip"
                        />
                      </Box>

                      {/* Job Info */}
                      <Typography variant="h6" className="job-title">
                        {entry.jobTitle}
                      </Typography>
                      <Box className="company-info">
                        <Business className="company-icon" />
                        <Typography variant="body1" className="company-name">
                          {entry.companyName}
                        </Typography>
                      </Box>

                      {/* Details Grid */}
                      <Box className="details-grid">
                        <Box className="detail-item">
                          <CalendarToday className="detail-icon" />
                          <Box>
                            <Typography variant="caption" className="detail-label">
                              Applied
                            </Typography>
                            <Typography variant="body2" className="detail-value">
                              {new Date(entry.applicationDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box className="detail-item">
                          <AttachMoney className="detail-icon" />
                          <Box>
                            <Typography variant="caption" className="detail-label">
                              Salary
                            </Typography>
                            <Typography variant="body2" className="detail-value">
                              ₹{entry.salary?.toLocaleString() || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Interview Info */}
                      {entry.interview && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Box className="interview-section">
                            <Typography variant="subtitle2" className="interview-title">
                              Interview Details
                            </Typography>
                            <Box className="interview-grid">
                              <Box className="interview-item">
                                <Typography variant="caption">Type</Typography>
                                <Typography variant="body2">
                                  {entry.interview.type || 'Not specified'}
                                </Typography>
                              </Box>
                              <Box className="interview-item">
                                <Typography variant="caption">Date</Typography>
                                <Typography variant="body2">
                                  {entry.interview.date 
                                    ? new Date(entry.interview.date).toLocaleDateString()
                                    : 'TBD'
                                  }
                                </Typography>
                              </Box>
                            </Box>
                            {entry.interview.meetingLink && (
                              <Button 
                                size="small" 
                                startIcon={<VideoCall />}
                                href={entry.interview.meetingLink}
                                target="_blank"
                                sx={{ mt: 1 }}
                              >
                                Join Meeting
                              </Button>
                            )}
                          </Box>
                        </>
                      )}
                    </CardContent>
                    
                    <CardActions className="job-actions">
                      <Button 
                        size="small" 
                        startIcon={<Edit />}
                        onClick={() => navigate(`/EditJobdetails/${entry._id}`)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </main>
    </div>
  );
}