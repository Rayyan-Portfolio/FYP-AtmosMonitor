import axios from 'axios';

// Create Axios instance with a dynamic base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Unauthorized Errors (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stored token and redirect to Sign In page if token is expired/invalid
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
