import React, { useState ,useEffect} from 'react';
import {
  TextField, Button, Box, Typography, Grid, Paper, Divider,
  MenuItem, Select, InputLabel, FormControl, Card, CardContent,
  InputAdornment, Chip, Alert
} from '@mui/material';
import {
  Work, Business, AttachMoney, CalendarToday, 
  VideoCall, Email, Link, Person,Description
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import './EditJobTrack.css';
import Sidebar from '../Sidebar/Sidebar';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';


export default function EditJobTrack({ isSidebarOpen }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {BASE_URL} = useAuth()
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    applicationDate: '',
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    salary: '',
    scan:'',
    status:'',
    interview:{
      date:'',
      email:'',
      meetingLink:'',
      type:''
    },
  });

  

    useEffect(() => {
    const fetchTracker = async () => {
      const res = await axios.get(`${BASE_URL}/track/job/${id}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(res.data.data)
    };
    fetchTracker();
    }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'salary'
      ? value === '' ? '' : Math.round(Number(value))
      : value
      }
    ));
    // setFormData(prev => ({
    //   ...prev,
    //   [e.target.name]: e.target.value
    // }));
  };

  const handleNestedChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    interview: {
      ...prev.interview,
      [name]: value
    }
  }));
};

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return '';
      const date = new Date(dateStr);
      return isNaN(date) ? '' : date.toISOString().split('T')[0];
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date) ? '' : date.toISOString().slice(0, 16);
  };




  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true); 
  try {
    const result = await axios.put(`${BASE_URL}/track/update/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Updated Data:", result.data);
    toast.success("Updated the details");
    navigate('/jobhistory');
  } catch (error) {
    console.error("Error updating job:", error);
    toast.error("Failed to update. Try again.");
  } finally {
    setIsSubmitting(false); 
  }
};

  if (!formData) return <div>Loading...</div>;


  const interviewTypes = [
    'Phone Interview',
    'Video Interview', 
    'In-Person Interview',
    'Panel Interview',
    'Technical Interview'
  ];

  return (
    <div>
    <Sidebar isSidebarOpen={isSidebarOpen}/>
    <Box className={`job-tracker-container ${isSidebarOpen ? 'opened' : 'change'}`}>
      <Card className="job-tracker-card" elevation={6}>
        <CardContent className="card-content">
          {/* Header Section */}
          <Box className="header-section">
            <Work className="header-icon" />
            <Typography variant="h4" className="main-title">
              Job Application Tracker
            </Typography>
            <Typography variant="subtitle1" className="subtitle">
              Keep track of your job applications and interview schedules
            </Typography>
          </Box>

          {/* {submitSuccess && (
            <Alert severity="success" className="success-alert">
              Job application added to tracker successfully!
            </Alert>
          )} */}

          <form onSubmit={handleSubmit}>
            {/* Job Details Section */}
            <Box className="form-section">
              <Box className="section-header">
                <Work className="section-icon" />
                <Typography variant="h6" className="section-title">
                  Job Details
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={10}>
                    <TextField
                      label="Job Description"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      className="custom-field"
                      placeholder="Describe the role, responsibilities, requirements, and what excites you about this opportunity..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" className="textarea-icon">
                            <Description className="field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Expected Salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Application Date"
                    name="applicationDate"
                    type="date"
                    value={formatDateOnly(formData.applicationDate)}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined" className="form-field">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                  <MenuItem value="Applied">Applied</MenuItem>
                  <MenuItem value="In Review">In Review</MenuItem>
                  <MenuItem value="Followed Up">Followed Up</MenuItem>
                  <MenuItem value="Interview Scheduled">Interview Scheduled</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Offered">Offered</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                </Select>
              </FormControl>
            </Grid>

              </Grid>
            </Box>

            {/* Interview Details Section */}
            <Box className="form-section">
              <Box className="section-header">
                <VideoCall className="section-icon" />
                <Typography variant="h6" className="section-title">
                  Interview Details
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth variant="outlined" className="form-field">
                    <InputLabel>Interview Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.interview.type}
                      onChange={handleNestedChange}
                      label="Interview Type"
                      startAdornment={
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select interview type</em>
                      </MenuItem>
                      {interviewTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Interview Date & Time"
                    name="date"
                    type="datetime-local"
                    value={formatDateForInput(formData.interview.date)}
                    onChange={handleNestedChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contact Email"
                    name="email"
                    type="email"
                    value={formData.interview.email}
                    onChange={handleNestedChange}
                    fullWidth
                    variant="outlined"
                    placeholder="recruiter@company.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Meeting Link"
                    name="meetingLink"
                    type="url"
                    value={formData.interview.meetingLink}
                    onChange={handleNestedChange}
                    fullWidth
                    variant="outlined"
                    placeholder="https://zoom.us/j/..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Link color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    className="form-field"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Submit Button */}
            <Box className="submit-section">
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                className="submit-button"
                startIcon={<Work />}
              >
                {isSubmitting ? (
                <>
                <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                Updating...
                </>
                ) : 'Update Details'}

              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
    </div>
  );
}