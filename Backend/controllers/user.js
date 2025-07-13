const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const {sendOtpEmail} = require('../utils/sendOtp.js')

//signup
module.exports.signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    const user = new User({ email, password, otp, otpExpires });
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(201).json({email:email, message: 'OTP sent to email. Please verify.' });

    // const user = new User({  email, password });
    // await user.save();

    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '14d' });
    // res.status(201).json({ token, user: { id: user._id, email },msg:"User Registered Successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Signup failed' });
  }
}
//Verify
module.exports.verifyOtp = async (req, res) => {
  try{
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  if (user.verified) return res.status(400).json({ message: 'Email already verified' });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.verified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '14d' });

  res.status(200).json({ 
    message: 'Registered successfully',
    token,
    user: { id: user._id, email }
  });
  }catch(err){
    res.status(500).json({ message: 'Email Not verified' });
  }
};


//Login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.verified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendOtpEmail(user.email, otp);

      return res.status(403).json({ 
        error: 'Email not verified',
        email: user.email
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '14d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email },msg:"User Logged In Successfully" });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
}


// controllers/user.js
module.exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verified) return res.status(400).json({ error: 'Email already verified' });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    user.otpExpires = Date.now() + 1 * 60 * 1000; // 1 minute expiry
    await user.save();

    await sendOtpEmail(email, newOtp);

    res.status(200).json({ message: 'OTP resent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
};


// Logout (for frontend: just clear token client-side)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});


