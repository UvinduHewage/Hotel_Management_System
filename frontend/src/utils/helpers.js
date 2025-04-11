import { 
    format, 
    parseISO, 
    differenceInDays, 
    differenceInHours,
    addDays
  } from 'date-fns';
  import { 
    DATE_FORMAT, 
    DATETIME_FORMAT, 
    DISPLAY_DATE_FORMAT,
    DISPLAY_DATETIME_FORMAT
  } from './constants';
  
  /**
   * Format a date string or object to display format
   * @param {string|Date} date - Date to format
   * @param {string} formatStr - Format string
   * @returns {string} - Formatted date string
   */
  export const formatDate = (date, formatStr = DISPLAY_DATE_FORMAT) => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, formatStr);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };
  
  /**
   * Format a datetime string or object to display format
   * @param {string|Date} datetime - Datetime to format
   * @param {string} formatStr - Format string
   * @returns {string} - Formatted datetime string
   */
  export const formatDateTime = (datetime, formatStr = DISPLAY_DATETIME_FORMAT) => {
    if (!datetime) return '';
    try {
      const dateObj = typeof datetime === 'string' ? parseISO(datetime) : datetime;
      return format(dateObj, formatStr);
    } catch (error) {
      console.error('Datetime formatting error:', error);
      return '';
    }
  };
  
  /**
   * Calculate the number of nights between two dates
   * @param {string|Date} checkIn - Check-in date
   * @param {string|Date} checkOut - Check-out date
   * @returns {number} - Number of nights
   */
  export const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    try {
      const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
      const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
      return differenceInDays(checkOutDate, checkInDate);
    } catch (error) {
      console.error('Night calculation error:', error);
      return 0;
    }
  };
  
  /**
   * Calculate the total price based on room rate and nights
   * @param {number} rate - Room rate per night
   * @param {number} nights - Number of nights
   * @returns {number} - Total price
   */
  export const calculateTotalPrice = (rate, nights) => {
    return rate * nights;
  };
  
  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: USD)
   * @returns {string} - Formatted currency string
   */
  export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };
  
  /**
   * Truncate text to a specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  /**
   * Get user's display name
   * @param {Object} user - User object
   * @returns {string} - Display name
   */
  export const getUserDisplayName = (user) => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || user.email || '';
  };
  
  /**
   * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
   * @param {*} value - Value to check
   * @returns {boolean} - True if empty, false otherwise
   */
  export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
  };
  
  /**
   * Generate a range of dates between start and end dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {Array<Date>} - Array of dates
   */
  export const getDateRange = (startDate, endDate) => {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    const dates = [];
    let currentDate = start;
    
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  };
  
  /**
   * Filter object properties
   * @param {Object} obj - Object to filter
   * @param {Array<string>} allowedKeys - Keys to keep
   * @returns {Object} - Filtered object
   */
  export const filterObjectProperties = (obj, allowedKeys) => {
    return Object.keys(obj)
      .filter(key => allowedKeys.includes(key))
      .reduce((newObj, key) => {
        newObj[key] = obj[key];
        return newObj;
      }, {});
  };
  
  /**
   * Generate pagination metadata
   * @param {number} totalItems - Total number of items
   * @param {number} currentPage - Current page number
   * @param {number} pageSize - Items per page
   * @returns {Object} - Pagination metadata
   */
  export const generatePaginationMetadata = (totalItems, currentPage, pageSize) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    
    return {
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      hasNext,
      hasPrev,
      nextPage: hasNext ? currentPage + 1 : null,
      prevPage: hasPrev ? currentPage - 1 : null,
    };
  };
  
  /**
   * Capitalize first letter of a string
   * @param {string} str - String to capitalize
   * @returns {string} - Capitalized string
   */
  export const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  /**
   * Parse query string parameters
   * @param {string} queryString - Query string
   * @returns {Object} - Parsed parameters
   */
  export const parseQueryParams = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  };
  
  /**
   * Create query string from parameters object
   * @param {Object} params - Parameters object
   * @returns {string} - Query string
   */
  export const createQueryString = (params) => {
    return Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  };
  
  /**
   * Convert file to base64 string
   * @param {File} file - File to convert
   * @returns {Promise<string>} - Base64 string
   */
  export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  export default {
    formatDate,
    formatDateTime,
    calculateNights,
    calculateTotalPrice,
    formatCurrency,
    truncateText,
    getUserDisplayName,
    isEmpty,
    getDateRange,
    filterObjectProperties,
    generatePaginationMetadata,
    capitalizeFirstLetter,
    parseQueryParams,
    createQueryString,
    fileToBase64,
    validateEmail
  };