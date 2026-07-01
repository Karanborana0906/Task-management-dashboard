import axiosInstance from './axios';

// Authentication API endpoints
const authApi = {
  // Register a new user
  register: (userData) => {
    return axiosInstance.post('/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  // Logout user
  logout: () => {
    return axiosInstance.post('/auth/logout');
  },

  // Get current user profile
  getProfile: () => {
    return axiosInstance.get('/auth/profile');
  },

  // Update user profile
  updateProfile: (userData) => {
    return axiosInstance.put('/auth/profile', userData);
  },

  // Change password
  changePassword: (passwordData) => {
    return axiosInstance.post('/auth/change-password', passwordData);
  },

  // Request password reset
  forgotPassword: (email) => {
    return axiosInstance.post('/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: (token, passwordData) => {
    return axiosInstance.post(`/auth/reset-password/${token}`, passwordData);
  },

  // Refresh access token
  refreshToken: (refreshToken) => {
    return axiosInstance.post('/auth/refresh-token', { refreshToken });
  },
};

export default authApi;
