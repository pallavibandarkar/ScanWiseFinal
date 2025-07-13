import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Auth.css";
import { TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";


export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = isLogin ? "http://localhost:8080/user/login" : "http://localhost:8080/user/signup";
    try {
      const res = await axios.post(url, form);
      console.log(res)
       if (!isLogin && res.data.email) {
      // Save email for OTP verification
        localStorage.setItem("verifyEmail", res.data.email);
        navigate("/verify");
        return;
      }


      if (res.data.user && res.data.token) {
        login(res.data.user, res.data.token);
        navigate("/dashboard");
      }
      setForm({
        email:"",
        password:"",
      })
      toast.success(res.data.msg);
    } catch (err) {
      console.log(err)
      if (isLogin && err.response?.status === 403 && err.response?.data?.email) {
        localStorage.setItem("verifyEmail", err.response.data.email);
        toast.error("Email not verified. Please verify.");
        navigate("/verify");
        return;
      }
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-box">
        <Typography variant="h5" fontWeight={600}>
          {isLogin ? "Sign in to your account" : "Create an account"}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          {isLogin ? "LogIn" : "Sign Up"}
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {isLogin ? (
            <>
              Not registered?{" "}
              <span className="auth-toggle" onClick={() => setIsLogin(false)}>
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span className="auth-toggle" onClick={() => setIsLogin(true)}>
                Sign in
              </span>
            </>
          )}
        </Typography>
      </Paper>
    </div>
  );
}
