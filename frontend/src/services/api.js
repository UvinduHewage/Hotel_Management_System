// src/services/api.js - Base API service
import { toast } from 'react-toastify';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

/**
 * Handles API response with error checking
 * @param {Response} response - Fetch response object
 * @returns {Promise} - Promise with parsed data or error
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If unauthorized and not currently logging in, handle token expiration
    if (response.status === 401 && !response.url.includes('/auth/login')) {
      toast.error('Your session has expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    
    // Throw error with message from response
    const error = data.message || response.statusText;
    throw new Error(error);
  }
  
  return data;
};

/**
 * Base API service with CRUD operations
 */
const api = {
  /**
   * Perform GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Promise with response data
   */
  get: async (endpoint) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  },
  
  /**
   * Perform POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request payload
   * @returns {Promise} - Promise with response data
   */
  post: async (endpoint, data) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  },
  
  /**
   * Perform PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request payload
   * @returns {Promise} - Promise with response data
   */
  put: async (endpoint, data) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  },
  
  /**
   * Perform DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Promise with response data
   */
  delete: async (endpoint) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  },
  
  /**
   * Upload file with multipart/form-data
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with files
   * @returns {Promise} - Promise with response data
   */
  upload: async (endpoint, formData) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
          // Note: Don't set Content-Type for multipart/form-data
        },
        body: formData
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`UPLOAD ${endpoint} error:`, error);
      throw error;
    }
  }
};

export default api;