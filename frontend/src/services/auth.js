import axios from 'axios';
import api from './api';

/**
 * Login user with credentials
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.emailOrUsername - Email or username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} - User data and token
 */

const API_URL = 'http://localhost:5000/api/auth/';

// Login function
export const login = async (credentials) => {
  try {
    const response = await axios.post(API_URL + 'login', credentials);
    
    // Check if response has data
    if (response.data) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registered user data
 */

// Signup function
export const signup = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(errorMessage);
  }
};

/**
 * Verify JWT token validity
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object|null>} - User data if token is valid, null otherwise
 */
export const verifyToken = async (token) => {
  try {
    const response = await api.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<Object|null>} - New token and user data if refresh successful
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return null;
  }
  
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    
    // Update tokens in localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  } catch (error) {
    return null;
  }
};

/**
 * Log out the current user
 * @returns {Promise<boolean>} - Success status
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} - Response data
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/password-reset-request', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset request failed');
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.password - New password
 * @returns {Promise<Object>} - Response data
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/auth/password-reset', resetData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};