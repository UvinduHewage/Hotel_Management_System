// utils/constants.js

/**
 * Application constants and configuration values
 */

// API URLs
export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Authentication
export const TOKEN_EXPIRY_TIME = 3600; // seconds (1 hour)
export const REFRESH_TOKEN_EXPIRY_TIME = 2592000; // seconds (30 days)

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STAFF: 'staff'
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';
export const DISPLAY_TIME_FORMAT = 'h:mm A';
export const DISPLAY_DATETIME_FORMAT = 'MMM DD, YYYY h:mm A';

// File size limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Room types
export const ROOM_TYPES = [
  { id: 'standard', label: 'Standard' },
  { id: 'deluxe', label: 'Deluxe' },
  { id: 'suite', label: 'Suite' },
  { id: 'executive', label: 'Executive' },
  { id: 'family', label: 'Family' },
  { id: 'presidential', label: 'Presidential' }
];

// Room status
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning',
  RESERVED: 'reserved'
};

// Room amenities
export const ROOM_AMENITIES = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'tv', label: 'TV' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'minibar', label: 'Mini Bar' },
  { id: 'safe', label: 'Safety Deposit Box' },
  { id: 'bathtub', label: 'Bathtub' },
  { id: 'shower', label: 'Shower' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'oceanview', label: 'Ocean View' },
  { id: 'cityview', label: 'City View' }
];

// Booking status
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show'
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'credit', label: 'Credit Card' },
  { id: 'debit', label: 'Debit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'cash', label: 'Cash' },
  { id: 'bank', label: 'Bank Transfer' }
];

// Navigation items for sidebar
export const NAV_ITEMS = {
  USER: [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/roomsUI', icon: 'ScanSearch', label: 'Browse Rooms' }
  ],
  ADMIN: [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/roomsUI', icon: 'ScanSearch', label: 'Browse Rooms' },
    { to: '/guest-management', icon: 'Users', label: 'Guest Dashboard' },
    { to: '/staff', icon: 'NotebookTabs', label: 'Staff Management' },
    { to: '/staff/add', icon: 'UserPlus', label: 'Add New Staff' },
    { to: '/attendance', icon: 'CheckSquare', label: 'Attendance' },
    { to: '/staff/export', icon: 'FileDown', label: 'Export Staff Data' },
    { to: '/bookingHome', icon: 'Grid2x2Check', label: 'Available Rooms' },
    { to: '/table', icon: 'ChartNoAxesGantt', label: 'Room Management' },
    { to: '/create-room', icon: 'PlusCircle', label: 'Create Room' },
    { to: '/booked-rooms', icon: 'BookCheck', label: 'Booked Rooms' },
    { to: '/reservation-history', icon: 'FileClock', label: 'Reservation History' }
  ]
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.'
};

export default {
  API_BASE_URL,
  TOKEN_EXPIRY_TIME,
  REFRESH_TOKEN_EXPIRY_TIME,
  USER_ROLES,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DATE_FORMAT,
  TIME_FORMAT,
  DATETIME_FORMAT,
  DISPLAY_DATE_FORMAT,
  DISPLAY_TIME_FORMAT,
  DISPLAY_DATETIME_FORMAT,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  ROOM_TYPES,
  ROOM_STATUS,
  ROOM_AMENITIES,
  BOOKING_STATUS,
  PAYMENT_METHODS,
  NAV_ITEMS,
  ERROR_MESSAGES
};