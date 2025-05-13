import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { signup, verifyOtp } from "../../api"; // Import API functions
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // OTP state
  const [otpSent, setOtpSent] = useState(false); // OTP Sent Status
  const [error, setError] = useState(""); // Error Handling
  const [otpError, setOtpError] = useState(""); // OTP Error Handling
  const [loading, setLoading] = useState(false); // Loading State
  const [formErrors, setFormErrors] = useState({}); // Errors for form validation

  // Form validation
 const validateForm = () => {
   const newErrors = {};
   const emailRegex =
     /^[^\s@]+@(gmail\.com|cfd\.nu\.edu\.pk|hotmail\.com|yahoo\.com|outlook\.com)$/;

   // Password regex: at least one uppercase letter, one lowercase letter, one number, and one special character
   const passwordRegex =
     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

   // Name validation
   if (!name.trim()) {
     newErrors.name = "Name is required.";
   } else if (!/^[a-zA-Z\s]*$/.test(name.trim())) {
     newErrors.name = "Name can only contain letters and spaces.";
   } else if (name.trim().length < 3) {
     newErrors.name = "Name must be at least 3 characters long.";
   }

   // Email validation
   if (!email.trim()) {
     newErrors.email = "Email is required.";
   } else if (!emailRegex.test(email.trim())) {
     newErrors.email = "Enter a valid email address.";
   }

   // Password validation
   if (!password.trim()) {
     newErrors.password = "Password is required.";
   } else if (!passwordRegex.test(password.trim())) {
     newErrors.password =
       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
   }

   setFormErrors(newErrors);

   // Return true if no errors exist
   return Object.keys(newErrors).length === 0;
 };

  // Handle user sign-up and send OTP
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Perform validation before submitting
    if (!validateForm()) {
      setLoading(false);
      return; // Don't submit if form is invalid
    }

    try {
      const data = await signup(name, email, password);
      setOtpSent(true);
      setError("");
      alert(data.message); // Show success message
    } catch (error) {
      setError(
        error.response
          ? error.response.data.error
          : "Sign-up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError("");

    try {
      const data = await verifyOtp(email, otp);
      alert(data.message); // Show success message
      navigate("/signin"); // Redirect to Sign-In
    } catch (error) {
      setOtpError(
        error.response ? error.response.data.error : "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <nav className="navbar">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            AtmosMonitor
          </div>
          <div className="navbar-links">
            <button className="nav-link" onClick={() => navigate("/")}>
              Explore More Before SignUp
            </button>
          </div>
          <div className="navbar-buttons">
            <button className="signin-btn" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          </div>
        </nav>
      </header>

      <div className="signup-container">
        <h2>Create Your Account</h2>
        {!otpSent ? (
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Username"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {formErrors.name && (
              <p style={{ color: "red" }}>{formErrors.name}</p>
            )}{" "}
            {/* Show name errors */}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && (
              <p style={{ color: "red" }}>{formErrors.email}</p>
            )}{" "}
            {/* Show email errors */}
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && (
              <p style={{ color: "red" }}>{formErrors.password}</p>
            )}{" "}
            {/* Show password errors */}
            <button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerification}>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {otpError && <p style={{ color: "red" }}>{otpError}</p>}

        <p>
          Already have an account?{" "}
          <a href="/signin" className="signin-link">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
