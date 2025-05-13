const express = require('express');
const router = express.Router();
const UserModel = require("../models/Users");  // Ensure correct path to the User model
const { signup, signin, forgotPassword, verifyOtp } = require("../controllers/authController"); // Ensure correct import

// User Signup Route (POST)
router.post('/signup', signup);

// User Signin Route (POST)
router.post('/signin', signin);

// OTP Verification Route (POST)
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otpEntered } = req.body;

    // Check if both email and OTP are provided
    if (!email || !otpEntered) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    // Centralized email format validation using a regular expression
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Normalize email before querying the database (for case insensitivity)
    const normalizedEmail = email.toLowerCase();

    // Fetch user from DB
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Verify OTP using the `verifyOtp` function
    const isOtpValid = await verifyOtp(user, otpEntered);  // Call the verifyOtp function
    if (!isOtpValid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Clear OTP after successful verification to ensure security
    user.otp = null;
    user.otpExpiryTime = null;
    await user.save();

    // Respond with success message
    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error in /verify-otp route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
