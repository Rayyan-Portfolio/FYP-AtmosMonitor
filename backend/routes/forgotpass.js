const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { generateOtp, verifyOtp } = require('../library/auth'); // Correct Import
const nodemailer = require('nodemailer');
require("dotenv").config();
const OTP_EXPIRY_TIME = 3 * 60 * 1000; // 3 minutes

// Forgot Password Route (Generate OTP and send to email)
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Generate OTP
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiryTime = Date.now() + OTP_EXPIRY_TIME; // Set expiry time for OTP
    await user.save();

    // Send OTP via email
    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email for password reset." });
  } catch (error) {
    next(error);
  }
});

// Verify OTP Route
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otpEntered } = req.body;

    if (!email || !otpEntered) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if OTP is expired
    if (Date.now() > user.otpExpiryTime) {
      return res.status(400).json({ error: "OTP has expired." });
    }

    // Verify OTP
    if (user.otp !== otpEntered) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // OTP is valid, so clear OTP data for security
    user.otp = null;
    user.otpExpiryTime = null;
    await user.save();

    res.status(200).json({ message: "OTP verified. You can now reset your password." });
  } catch (error) {
    next(error);
  }
});

// Send OTP via Email
async function sendOtpToEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Secure Credentials
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

module.exports = router;
