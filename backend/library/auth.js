const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Secure 6-digit OTP
};

// Verify OTP entered by the user
const verifyOtp = async (email, otpEntered) => {
  const user = await require("../models/Users").findOne({ email });

  if (!user || !user.otp || Date.now() > user.otpExpiryTime) {
    return false; // OTP expired or not set
  }

  if (user.otp === otpEntered) {
    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiryTime = null;
    await user.save();
    return true;
  }
  return false;
};

module.exports = { generateToken, generateOtp, verifyOtp };
