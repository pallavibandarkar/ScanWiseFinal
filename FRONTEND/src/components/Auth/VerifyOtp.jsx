import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function VerifyOtp() {
  const { login, BASE_URL } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(60);
  const [disabledResend, setDisabledResend] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('verifyEmail');
    if (!storedEmail) {
      navigate('/auth');
    } else {
      setEmail(storedEmail);
    }
  }, []);

  // countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setDisabledResend(false);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/user/verify-otp`, {
        email,
        otp,
      });

      toast.success(res.data.message);
      localStorage.removeItem('verifyEmail');

      if (res.data.user && res.data.token) {
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${BASE_URL}/user/resend-otp`, { email });
      toast.success('OTP resent successfully');
      setTimer(60);
      setDisabledResend(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    }
  };

  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-box">
        <Typography variant="h5">Verify Your Email</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          OTP sent to <strong>{email}</strong>
        </Typography>

        <TextField
          fullWidth
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          margin="normal"
        />

        <Typography sx={{ mt: 1 }}>
          OTP expires in: <strong>{formatTime(timer)}</strong>
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerify}
          sx={{ mt: 2 }}
        >
          Verify OTP
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleResend}
          disabled={disabledResend}
          sx={{ mt: 1 }}
        >
          Resend OTP
        </Button>
      </Paper>
    </div>
  );
}
