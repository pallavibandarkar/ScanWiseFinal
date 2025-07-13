import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  Typography, 
  Box, 
  Button, 
  Container,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Work,
  Business,
  CalendarToday,
  AttachMoney,
  VideoCall,
  Email,
  Edit,
  PendingActions,
  Visibility
} from '@mui/icons-material';
import './JobTrackHistory.css';

import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';

export default function JobTrackHistory({isSidebarOpen}) {
  const [entries, setEntries] = useState([]);
  const { user,BASE_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/track/user/`, {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    return salary ? `₹${salary.toLocaleString()}` : 'Not specified';
  };

  return (
    <div className="page-layout">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <Button className="print-btn" variant="contained" onClick={() => navigate('/scanwise/jobtracker')}>
          Add to track
        </Button>
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

          {/* Stats
          <Box className="stats-grid">
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

          {/* Table Content */}
          {entries.length === 0 ? (
            <Paper className="empty-state">
              <Box className="empty-content">
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
                  onClick={() => navigate('/scanwise/jobtracker')}
                  sx={{ mt: 2 }}
                >
                  Add Your First Application
                </Button>
              </Box>
            </Paper>
          ) : (
            <TableContainer component={Paper} className="table-container">
              <Table className="jobs-table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className="table-header">Job Details</TableCell>
                    <TableCell className="table-header">Company</TableCell>
                    <TableCell className="table-header">Status</TableCell>
                    <TableCell className="table-header">Applied Date</TableCell>
                    <TableCell className="table-header">Salary</TableCell>
                    <TableCell className="table-header">Interview</TableCell>
                    <TableCell className="table-header">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry._id} className="table-row">
                      <TableCell className="job-cell">
                        <Box className="job-info">
                          <Typography variant="subtitle1" className="job-title">
                            {entry.jobTitle}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell className="company-cell">
                        <Box className="company-info">
                          <Business className="company-icon" />
                          <Typography variant="body2" className="company-name">
                            {entry.companyName}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell className="status-cell">
                        <Chip 
                          icon={getStatusIcon(entry.status)}
                          label={entry.status}
                          color={getStatusColor(entry.status)}
                          size="small"
                          className="status-chip"
                        />
                      </TableCell>
                      
                      <TableCell className="date-cell">
                        <Box className="date-info">
                          <CalendarToday className="date-icon" />
                          <Typography variant="body2">
                            {formatDate(entry.applicationDate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell className="salary-cell">
                        <Box className="salary-info">
                          <AttachMoney className="salary-icon" />
                          <Typography variant="body2">
                            {formatSalary(entry.salary)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell className="interview-cell">
                        {entry.interview ? (
                          <Box className="interview-info">
                            <Typography variant="caption" className="interview-type">
                              {entry.interview.type || 'Scheduled'}
                            </Typography>
                            <Typography variant="body2" className="interview-date">
                              {entry.interview.date ? formatDate(entry.interview.date) : 'TBD'}
                            </Typography>
                            {entry.interview.meetingLink && (
                              <Tooltip title="Join Meeting">
                                <IconButton 
                                  size="small" 
                                  href={entry.interview.meetingLink}
                                  target="_blank"
                                  className="meeting-button"
                                >
                                  <VideoCall />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" className="no-interview">
                            Not scheduled
                          </Typography>
                        )}
                      </TableCell>
                      
                      <TableCell className="actions-cell">
                        <Tooltip title="Edit Application">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/scanwise/EditJobdetails/${entry._id}`)}
                            className="edit-button"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </main>
    </div>
  );
}