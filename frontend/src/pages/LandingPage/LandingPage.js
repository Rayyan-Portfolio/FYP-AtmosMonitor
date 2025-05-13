// src/pages/LandingPage/LandingPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import aqmImage from "../../assets/images/aqm.jfif";
import riskForecastImage from "../../assets/images/RiskForecast.jfif";
import alertImage from "../../assets/images/Alert.jfif";
import predictionImage from "../../assets/images/predicton.jfif";
import smartwatchesImage from "../../assets/images/smartwatches.jfif";
import dataVisualImage from "../../assets/images/datavisual.jfif";
import DrFayyaz from "../../assets/images/Dr Fayyaz.jpg";
import Razeen from "../../assets/images/Razeen.jpg";
import Rayyan from "../../assets/images/rayyan.png";
import Maryam from "../../assets/images/maryam.jfif";
import logo from "./logo.png";
const LandingPage = () => {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing in the field
    setErrors({
      ...errors,
      [name]: "",
    });

        if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            name: "Name can only contain letters and spaces.",
          }));

        }
  };

  
  const validateForm = () => {
    const newErrors = {};
const emailRegex =
  /^[^\s@]+@(gmail\.com|cfd\.nu\.edu\.pk|hotmail\.com|yahoo\.com|outlook\.com)$/;





    // Name validation: required, letters/spaces only, min 3 characters
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:3001/api/contact", formData);
        setStatus(response.data.message);
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        setTimeout(() => setStatus(""), 3000);
      } catch (error) {
        setStatus("Failed to send message. Please try again.");
      }
    }
  };



  const [selectedPlan, setSelectedPlan] = useState(null);
  
    const plans = [
      {
        id: 1,
        name: "7-Day Free Trial",
        description: "Enjoy the premium features for 7 days, completely free!",
        price: "0",
        duration: "7 days",
        features: {
          "Login and Sign-Up": true,
          "Manage Accounts": true,
          "Monitor Environment": true,
          "View Dashboard": true,
          "Provide Recommendations": false,
          "Manage Alerts": false,
          "Integrate Smart Devices": false,
        },
      },
      {
        id: 2,
        name: "Monthly Plan",
        description: "Get access to premium features for one month.",
        price: "5,000",
        duration: "1 month",
        features: {
          "Login and Sign-Up": true,
          "Manage Accounts": true,
          "Monitor Environment": true,
          "View Dashboard": true,
          "Provide Recommendations": true,
          "Manage Alerts": true,
          "Integrate Smart Devices": false,
        },
      },
      {
        id: 3,
        name: "Yearly Plan",
        description: "Get access to premium features for one full year.",
        price: "50,000",
        duration: "1 year",
        features: {
          "Login and Sign-Up": true,
          "Manage Accounts": true,
          "Monitor Environment": true,
          "View Dashboard": true,
          "Provide Recommendations": true,
          "Manage Alerts": true,
          "Integrate Smart Devices": true,
        },
      },
    ];
  
    const handleBuySubscription = (planId) => {
      const plan = plans.find((p) => p.id === planId); // Find the selected plan based on ID
      setSelectedPlan(plan); // Store the selected plan in the state
      navigate("/checkout", { state: { selectedPlan: plan } }); // Pass the selected plan data to Checkout page using state
    };
  


  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div
          className="navbar-logo"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <img
            src={logo}
            alt="AtmosMonitor Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <span>AtmosMonitor</span>
        </div>
        <div className="navbar-links">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Home
          </a>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              document
                .getElementById("features") // Target the "about-section" element
                .scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
            }}
          >
            Services
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              document
                .getElementById("about-section") // Target the "about-section" element
                .scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
            }}
          >
            About
          </a>
          {/*   <a href="#subplan" onClick={() => navigate("/subplan")}>
            Subscription Plan
          </a>*/}
          <a
            href="#subscription-header"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("subscription-header")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Subscription Plan
          </a>
          <a
            href="#contact-section"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact-section")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact
          </a>

          <a href="#dashboard" onClick={() => navigate("/dashboard")}>
            Dashboard
          </a>
        </div>
        <div className="navbar-buttons">
          <button className="signin-btn" onClick={() => navigate("/signin")}>
            Sign In
          </button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1
            style={{
              textShadow: "2px 2px 4px black", // Creates a black outline effect
              WebkitTextStroke: "1px black", // Adds a sharp black border
              color: "white", // Ensures readability
            }}
          >
            Welcome to AtmosMonitor
          </h1>

          <p
            style={{
              textShadow: "1px 1px 3px black", // Slight black shadow for readability
              WebkitTextStroke: "0.5px black", // Thinner black border for text
              color: "white",
            }}
          >
            Your Gateway to Environmental Insights
          </p>

          <button onClick={() => navigate("/signup")} className="hero-button">
            Explore More
          </button>

          {/* YouTube Video (Uncomment for Online Use) */}
          {/* <iframe
            className="background-video"
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/yX5WtyGyp2Y?autoplay=1&loop=1&mute=1&playlist=yX5WtyGyp2Y"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          ></iframe> */}

          
          <video className="background-video" width="100%" height="100%" autoPlay loop muted playsInline>
            <source src="/Videos/earthloop.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video> 
         
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h1>Our Services</h1>
        <p className="features-subtitle">
          See what we provide with AtmosMonitor.
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            <img
              src={aqmImage}
              alt="Real-time Air Quality Monitoring"
              className="feature-image"
            />
            <h3>View Dashboard</h3>
            <p>Plan your commute with insights on traffic and air quality.</p>
          </div>
          <div className="feature-card">
            <img
              src={predictionImage}
              alt="Traffic and Pollution Prediction"
              className="feature-image"
            />
            <h3>Monitoring Environment</h3>
            <p>Stay updated with data on air quality conditions.</p>
          </div>
          <div className="feature-card">
            <img
              src={dataVisualImage}
              alt="Data Visualization"
              className="feature-image"
            />
            <h3>Visualize Data</h3>
            <p>
              Interactive charts and graphs provide clear and concise views of
              your environment.
            </p>
          </div>
          <div className="feature-card">
            <img
              src={riskForecastImage}
              alt="Health Risk Forecasting"
              className="feature-image"
            />
            <h3>Provide Recommendations</h3>
            <p>
              Predict potential health risks based on environmental data trends.
            </p>
          </div>
          <div className="feature-card">
            <img
              src={alertImage}
              alt="Custom Alerts"
              className="feature-image"
            />
            <h3>Managing Alerts</h3>
            <p>Set and receive alerts for specific environmental thresholds.</p>
          </div>
          <div className="feature-card">
            <img
              src={smartwatchesImage}
              alt="Smart Device Integration"
              className="feature-image"
            />
            <h3>Integrating Mobile Devices</h3>
            <p>
              Optimize your environment with seamless device
              connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about-section">
        <h1>About Us</h1>
        <p>
          AtmosMonitor is an innovative, state-of-the-art platform designed to
          revolutionize the way we monitor, analyze, and respond to air quality.
          With air pollution becoming an increasingly pressing global issue,
          AtmosMonitor aims to empower individuals, communities, and
          organizations with tools and insights for a healthier and more
          sustainable future.
        </p>
        <p></p>

        <h2 style={{ textAlign: "center" }}>Our Team</h2>

        <div className="team-cards">
          <div className="team-card">
            <img src={DrFayyaz} alt="DrFayyaz" style={{ width: "100%" }} />
            <div className="team-card-container">
              <h2>Dr. Muhammad Fayyaz</h2>
              <p className="title">Supervisor</p>
              <p>
                Associate Professor and HOD of Computer Science at FAST–NUCES
              </p>
              <p>
                <button
                  className="button"
                  onClick={() =>
                    (window.location.href = "mailto:m.fayyaz@nu.edu.pk")
                  }
                >
                  Contact
                </button>
              </p>
            </div>
          </div>

          <div className="team-card">
            <img src={Razeen} alt="razeen" style={{ width: "100%" }} />
            <div className="team-card-container">
              <h2>Razeen Shahid</h2>
              <p className="title">Founder</p>
              <p>Student at FAST-NUCES</p>
              <p>ML Engineer</p>
              <p>
                <button
                  className="button"
                  onClick={() =>
                    (window.location.href = "mailto:f219224@cfd.nu.edu.pk")
                  }
                >
                  Contact
                </button>
              </p>
            </div>
          </div>

          <div className="team-card">
            <img src={Rayyan} alt="Rayyan" style={{ width: "100%" }} />
            <div className="team-card-container">
              <h2>Ahmad Rayyan</h2>
              <p className="title">Founder</p>
              <p>Student at FAST-NUCES</p>
              <p>Frontend Developer</p>
              <p>
                <button
                  className="button"
                  onClick={() =>
                    (window.location.href = "mailto:f219266@cfd.nu.edu.pk")
                  }
                >
                  Contact
                </button>
              </p>
            </div>
          </div>

          <div className="team-card">
            <img src={Maryam} alt="Maryam" style={{ width: "100%" }} />
            <div className="team-card-container">
              <h2>Maryam Tariq</h2>
              <p className="title">Founder</p>
              <p>Student at FAST-NUCES</p>
              <p>Backend Developer</p>
              <p>
                <button
                  className="button"
                  onClick={() =>
                    (window.location.href = "mailto:f219337@cfd.nu.edu.pk")
                  }
                >
                  Contact
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      <h2 className="subscription-header" id="subscription-header">
        Choose Your Subscription Plan
      </h2>
      <div className="subscription-container">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <h3>{plan.name}</h3>
            </div>
            <p className="plan-description">{plan.description}</p>
            <div className="plan-price">
              <h4>Rs.{plan.price}</h4>
              <span className="plan-duration">{plan.duration}</span>
            </div>

            <div className="plan-features">
              {Object.keys(plan.features).map((feature, index) => (
                <div key={index} className="feature-item">
                  <span
                    className={
                      plan.features[feature]
                        ? "feature-checked"
                        : "feature-unchecked"
                    }
                  >
                    {plan.features[feature] ? "✓" : "✘"}
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              className="buy-button"
              onClick={() => handleBuySubscription(plan.id)}
            >
              Get {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <section id="contact-section" className="contact-section">
        <div className="contact-form-container">
          <h1>Contact Us</h1>
          <p>Have questions or need support? Fill out the form below to get in touch with us.</p>

          {status && <p className={`status-message ${status.includes("Failed") ? "error" : "success"}`}>{status}</p>}

          <form onSubmit={handleSubmit} className="contact-form">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
            {errors.name && <p className="error-message">{errors.name}</p>}

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} />
            {errors.message && <p className="error-message">{errors.message}</p>}

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
      {/* Footer Section */}
      <footer
        className="footer"
        style={{
          backgroundColor: "#000",
          color: "white",
          padding: "3rem 2rem",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          className="footer-content"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          {/* Contact Section */}
          <div
            className="footer-contact"
            style={{ flex: 1, minWidth: "250px" }}
          >
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Contact Us
            </h3>
            <div className="contact-info">
              <p
                style={{
                  fontSize: "1rem",
                  color: "#ccc",
                  marginBottom: "0.5rem",
                }}
              >
                Or reach us at:
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:atmosmonitor@gmail.com"
                  style={{ color: "#1d865e", textDecoration: "none" }}
                >
                  atmosmonitor@gmail.com
                </a>
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#ccc",
                  marginBottom: "0.5rem",
                }}
              >
                Phone: +92 3326593213
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#ccc",
                  marginBottom: "0.5rem",
                }}
              >
                Address: Faisalabad, Pakistan.
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-links" style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Quick Links
            </h3>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                display: "block",
                color: "#ccc",
                fontSize: "1rem",
                marginBottom: "0.5rem",
                textDecoration: "none",
              }}
            >
              Home
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "block",
                color: "#ccc",
                fontSize: "1rem",
                marginBottom: "0.5rem",
                textDecoration: "none",
              }}
            >
              Services
            </a>
            <a
              href="#contact-section"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact-section")
                  .scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "block",
                color: "#ccc",
                fontSize: "1rem",
                marginBottom: "0.5rem",
                textDecoration: "none",
              }}
            >
              Contact
            </a>
          </div>

          {/* Social Media Section */}
          <div className="footer-social" style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Follow Us
            </h3>
            <div className="social-icons">
              <a
                href="#linkedIN"
                aria-label="LinkedIn"
                style={{
                  color: "#ccc",
                  marginRight: "1rem",
                  textDecoration: "none",
                }}
              >
                LinkedIn
              </a>
              <a
                href="#Twitter"
                aria-label="Twitter"
                style={{
                  color: "#ccc",
                  marginRight: "1rem",
                  textDecoration: "none",
                }}
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          className="footer-bottom"
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "1rem",
            color: "#bbb",
          }}
        >
          <p>&copy; 2024 AtmosMonitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
