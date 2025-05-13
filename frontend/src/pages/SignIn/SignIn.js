import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, verifyOtp } from "../../api"; // Added import for verifyOtp from api.js
import "./SignIn.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // State for OTP
  const [otpSent, setOtpSent] = useState(false); // Track whether OTP has been sent
  const [error, setError] = useState(""); // Error message state
  const [loading, setLoading] = useState(false); // Loading state to show spinner during requests

  // Handle sign-in form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password); // API call to verify email and password

      if (data.message === "OTP verification required") {
        // If OTP is required after login
        setOtpSent(true);
      } else {
        // If login is successful without needing OTP
        localStorage.setItem("token", data.token); // Store JWT token
        navigate("/"); // Redirect to dashboard
      }
    } catch (error) {
      // Handle error during login
      setError(error.response ? error.response.data.error : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification form submission
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verify OTP after the email/password login
      const response = await verifyOtp(email, otp);
      if (response.message === "OTP verified successfully.") {
        localStorage.setItem("token", response.token); // Store token after OTP verification
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError(error.response ? error.response.data.error : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <header className="signin-header">
        <nav className="navbar">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            AtmosMonitor
          </div>
        </nav>
      </header>
      <div className="signin-container">
        <h2>LOGIN TO YOUR ACCOUNT</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{loading ? "Signing In..." : "Sign In"}</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error message if any */}
        
        {/* Forgot Password link */}
        <div className="forgot-password">
          <button className="forgot-password-link" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </button>
        </div>

        <p>
          Don't have an account?{" "}
          <a href="/signup" className="signup-link">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
