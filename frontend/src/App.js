import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const SignIn = lazy(() => import("./pages/SignIn/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));
const Contact = lazy(() => import("./pages/LandingPage/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard/dashboard"));
const SubPlan = lazy(() => import("./pages/Subscription/SubPlan"));
const Checkout = lazy(() => import("./pages/Subscription/Checkout"));
const ForgotPassword = lazy(() => import("./pages/SignIn/forgetpass"));

const ErrorBoundary = ({ children }) => (
  <Suspense fallback={<div>Something went wrong, please try again later.</div>}>
    {children}
  </Suspense>
);

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token");
  const otpVerified = localStorage.getItem("otpVerified");

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (otpVerified !== "true") {
    return <Navigate to="/otp-verification" />;
  }

  return element;
};

function App() {
  // Check auth state when the app loads
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const otpVerified = localStorage.getItem("otpVerified");

  //   if (token && otpVerified !== "true") {
  //     window.location.href = "/otp-verification";
  //   }
  // }, []);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/dashboard"
              element={<Dashboard />}
              //  element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/checkout"
              element={<Checkout />}
              //              element={<ProtectedRoute element={<Checkout />} />}
            />
            <Route
              path="/subplan"
              element={<SubPlan />}
              //element={<ProtectedRoute element={<SubPlan />} />}
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
