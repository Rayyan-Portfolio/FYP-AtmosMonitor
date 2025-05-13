import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtpForPasswordReset, resetPasswordWithOtp } from "../../api"; // Ensure these API functions are correctly set up
import "./forgetpass.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle OTP request to be sent
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await sendOtpForPasswordReset(email); // Ensure backend is set up for this request
      setMessage(data.message); // Success message from backend
      setOtpSent(true); // Show OTP form
      setError(""); // Clear previous errors
    } catch (error) {
      setError(error.response ? error.response.data.error : "Failed to send OTP. Please try again.");
      setMessage(""); // Clear any previous success messages
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await resetPasswordWithOtp(email, otp, newPassword); // Reset password using OTP
      setMessage(data.message); // Show success message
      setError(""); // Clear previous errors
      setOtp(""); // Clear OTP input field for security
      setNewPassword(""); // Clear new password input field

      setTimeout(() => {
        navigate("/signin"); // Redirect to Sign-In page after successful reset
      }, 2000);
    } catch (error) {
      setError(error.response ? error.response.data.error : "Failed to reset password. Try again.");
      setMessage(""); // Clear any previous success messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <header className="forgot-password-header">
        <nav className="navbar">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            AtmosMonitor
          </div>
        </nav>
      </header>
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>

        {/* Form to send OTP */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // Form to reset password using OTP
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              value={otp}
              placeholder="Enter OTP"
              required
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              value={newPassword}
              placeholder="Enter new password"
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>
          Remembered your password?{" "}
          <a href="/signin" className="signin-link">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
