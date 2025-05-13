import axiosInstance from "./utils/axios";

// API call for sign-in (login)
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/signin", { email, password });
    return response.data; // Return the response data from the backend
  } catch (error) {
    throw error.response ? error.response.data : "An error occurred while logging in";
  }
};

// API call for sign-up (register)
export const signup = async (name, email, password) => {
  try {
    const response = await axiosInstance.post("/auth/signup", { name, email, password });
    return response.data; // Return the response data from the backend
  } catch (error) {
    throw error.response ? error.response.data : "An error occurred during sign-up";
  }
};

// API call for sending OTP for password reset
export const sendOtpForPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data; // Return the success message for OTP request
  } catch (error) {
    throw error.response ? error.response.data : "An error occurred while sending OTP";
  }
};

// API call to verify OTP for password reset
export const verifyOtpForPasswordReset = async (email, otp) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", { email, otpEntered: otp });
    return response.data; // Return the success message after OTP verification
  } catch (error) {
    throw error.response ? error.response.data : "An error occurred while verifying OTP";
  }
};

// API call to reset the password after OTP verification
export const resetPasswordWithOtp = async (email, newPassword) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", { email, newPassword });
    return response.data; // Return the success message after password reset
  } catch (error) {
    throw error.response ? error.response.data : "An error occurred while resetting the password";
  }
};

// API call to verify OTP for login
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", { email, otpEntered: otp });
    return response.data; // Return the success message after OTP verification
  } catch (error) {
    throw error.response ? error.response.data : "An error occurred while verifying OTP";
  }
};
