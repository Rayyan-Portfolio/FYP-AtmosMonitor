const UserModel = require("../models/Users");
const { generateToken } = require("../library/auth");
const nodemailer = require('nodemailer');

const OTP_EXPIRY_TIME = 3 * 60 * 1000; // 3 minutes

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    // Create new user
    const newUser = new UserModel({ name, email: normalizedEmail, password });
    await newUser.save();

    // Generate OTP
    const otp = generateOtp();
    await sendOtpToEmail(normalizedEmail, otp);

    // Store OTP in the database
    newUser.otp = otp;
    newUser.otpExpiryTime = Date.now() + OTP_EXPIRY_TIME;
    await newUser.save();

    res.status(201).json({ message: "User registered successfully. OTP sent to your email for verification." });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

/* Signin Controller
exports.signin = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json({ error: "Email, password, and OTP are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isOtpValid = await verifyOtp(user, otp);
    if (!isOtpValid) {
      return res.status(401).json({ error: "Invalid or expired OTP." });
    }

    // Clear OTP after use
    user.otp = null;
    user.otpExpiryTime = null;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}; */
// Signin Controller
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    
    // Check if user exists in the database
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      // If email is not found, send error response
      return res.status(404).json({ error: "Invalid email." });
    }

    // Check if password matches the stored hashed password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      // If password is incorrect, send error response
      return res.status(401).json({ error: "Invalid password." });
    }

    // If the email and password are correct, generate a JWT token
    const token = generateToken(user._id);

    // Send success response with the token
    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const otp = generateOtp();
    await sendOtpToEmail(email, otp);

    user.otp = otp;
    user.otpExpiryTime = Date.now() + OTP_EXPIRY_TIME;
    await user.save();

    res.status(200).json({ message: "OTP sent to your email for password reset." });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

// Generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOtpToEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

exports.verifyOtp = async function (user, otpEntered) {
  try {
    if (!user.otp || !user.otpExpiryTime || Date.now() > user.otpExpiryTime) {
      return false;
    }
    return user.otp === otpEntered;
  } catch (error) {
    console.error("OTP verification error:", error);
    return false;
  }
};
