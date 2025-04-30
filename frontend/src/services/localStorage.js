// Set item with optional expiration
export const setItem = (key, value, expirationInMinutes = null) => {
    try {
      // Create storage object
      const item = {
        value: value,
        timestamp: new Date().getTime(),
      };
      
      // Add expiration if provided
      if (expirationInMinutes) {
        item.expiration = expirationInMinutes * 60 * 1000;
      }
      
      // Store stringified item
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error storing data in localStorage:', error);
      return false;
    }
  };
  
  // Get item and check expiration
  export const getItem = (key) => {
    try {
      const itemStr = localStorage.getItem(key);
      
      // Return null if item doesn't exist
      if (!itemStr) {
        return null;
      }
      
      // Parse stored item
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();
      
      // Check for expiration
      if (item.expiration && now > item.timestamp + item.expiration) {
        // Item has expired - remove it
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return null;
    }
  };
  
  // Remove item
  export const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
      return false;
    }
  };
  
  // Clear all items
  export const clearAll = () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  };
  
  // Get all keys
  export const getAllKeys = () => {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting keys from localStorage:', error);
      return [];
    }
  };
  
  // User-specific storage functions
  export const setUserData = (userData) => {
    return setItem('user', userData);
  };
  
  export const getUserData = () => {
    return getItem('user');
  };
  
  export const setAuthToken = (token, expirationInMinutes = 60) => {
    return setItem('token', token, expirationInMinutes);
  };
  
  export const getAuthToken = () => {
    return getItem('token');
  };
  
  export const clearUserSession = () => {
    removeItem('user');
    removeItem('token');
    removeItem('refreshToken');
  };
  
  // Check if user is authenticated based on local storage
  export const isAuthenticated = () => {
    const token = getAuthToken();
    const user = getUserData();
    return !!token && !!user;
  };
  
  export default {
    setItem,
    getItem,
    removeItem,
    clearAll,
    getAllKeys,
    setUserData,
    getUserData,
    setAuthToken,
    getAuthToken,
    clearUserSession,
    isAuthenticated
  };