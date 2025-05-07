import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Calendar from "../../components/Bawantha_components/Calendar";
import BookedRoomsFilter from "../../components/Bawantha_components/BookedRoomsFilter";
import BookedRoomsTable from "../../components/Bawantha_components/BookedRoomsTable";
import RoomGrid from "../../components/Bawantha_components/RoomGrid";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

// Toast notification component
const Toast = ({ type, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3
        ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
      `}
    >
      {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
      <div className="flex-grow">{message}</div>
      <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1">
        <span className="text-white font-bold">×</span>
      </button>
    </motion.div>
  );
};

const BookedRooms = () => {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filteredTableBookings, setFilteredTableBookings] = useState([]);
  const [selectedBookedDates, setSelectedBookedDates] = useState([]);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const incomingRoomNumber = location.state?.roomNumber || null;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = () => {
    setToast(null);
  };

  const fetchBookedRooms = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get("http://localhost:5000/api/bookings");
      setBookedRooms(response.data.data);
      setOriginalData(response.data.data);
      setFilteredTableBookings(response.data.data);
      
      if (!isInitialLoad) {
        showToast('success', 'Booking data updated successfully');
      }
      
      setIsInitialLoad(false);
    } catch (error) {
      console.error("Error fetching booked rooms:", error);
      showToast('error', 'Failed to load booking data');
    } finally {
      setIsRefreshing(false);
    }
  }, [isInitialLoad]);

  useEffect(() => {
    fetchBookedRooms();
  }, [fetchBookedRooms]);

  useEffect(() => {
    if (incomingRoomNumber && originalData.length > 0) {
      const filtered = originalData.filter((r) => r.roomNumber === incomingRoomNumber);
      if (filtered.length > 0) {
        setFilteredTableBookings(filtered);
        window.history.replaceState({}, document.title); // optional cleanup
      }
    }
  }, [incomingRoomNumber, originalData]);

  // Helper function to get dates between check-in and check-out
  const getDatesBetween = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleFilter = ({ roomNumber, checkInDate, checkOutDate }) => {
    let filtered = [...originalData];

    if (roomNumber.trim()) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(roomNumber.toLowerCase())
      );
    }

    if (checkInDate && checkOutDate) {
      const filterStart = new Date(checkInDate);
      const filterEnd = new Date(checkOutDate);

      filtered = filtered.filter((booking) => {
        const bookingStart = new Date(booking.checkInDate);
        const bookingEnd = new Date(booking.checkOutDate);
        return bookingStart <= filterEnd && bookingEnd >= filterStart;
      });
    }

    setBookedRooms(filtered);
    setFilteredTableBookings(filtered);
    // Clear selected dates when filtering
    setSelectedBookedDates([]);
  };

  const handleRoomClick = (roomNumber) => {
    const filtered = originalData.filter((room) => room.roomNumber === roomNumber);

    if (filtered.length > 0) {
      setFilteredTableBookings(filtered);

      const booking = filtered[0];
      if (booking.checkInDate && booking.checkOutDate) {
        const dates = getDatesBetween(
          new Date(booking.checkInDate),
          new Date(booking.checkOutDate)
        );
        setSelectedBookedDates(dates);
      }
    } else {
      showToast('error', `No booking found for room: ${roomNumber}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Enhanced Action Button Component for BookedRoomsTable
  const ActionButtons = ({ booking, onCheckout, onEdit, onDelete }) => {
    return (
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => onCheckout(booking)}
          className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium transition-colors border border-green-200 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Checkout</span>
        </button>
        
        <button
          onClick={() => onEdit(booking)}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors border border-blue-200 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </button>
        
        <button
          onClick={() => onDelete(booking.id)}
          className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors border border-red-200 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast type={toast.type} message={toast.message} onClose={closeToast} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-5 px-4 md:px-8 shadow-sm mb-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Hotel Management System
          </h1>
          <p className="text-gray-600">Room Bookings Dashboard</p>
        </div>
      </div>

      <motion.div
        className="container mx-auto px-4 pb-12 max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Filter Section */}
        <motion.div
          className="bg-white p-4 md:p-5 shadow-md rounded-lg mb-5 border-l-4 border-blue-500"
          variants={itemVariants}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Search & Filter
          </h2>
          <BookedRoomsFilter onFilter={handleFilter} />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main Table Section */}
          <motion.div
            className="lg:w-3/4 bg-white p-4 md:p-6 shadow-md rounded-lg"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                Booked Rooms
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredTableBookings.length}
                </span>
              </h2>
              
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={fetchBookedRooms}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Refresh
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isRefreshing ? 'refreshing' : 'content'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto"
              >
                <BookedRoomsTable
                  bookedRooms={filteredTableBookings}
                  refreshBookings={fetchBookedRooms}
                  ActionButtons={ActionButtons}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar Section */}
          <motion.div className="lg:w-1/4 space-y-5" variants={itemVariants}>
            {/* Room Grid */}
            <div className="bg-white p-4 md:p-5 shadow-md rounded-lg border-t-4 border-indigo-500">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Room Overview
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isRefreshing ? 'refreshing-grid' : 'grid-content'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RoomGrid
                    rooms={bookedRooms}
                    mode="booked"
                    bookings={bookedRooms}
                    onRoomClick={handleRoomClick}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Room status legend */}
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Checking Out Today</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-4 md:p-5 shadow-md rounded-lg border-t-4 border-purple-500">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Availability Calendar
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isRefreshing ? 'refreshing-calendar' : 'calendar-content'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Calendar 
                    selectedDates={selectedBookedDates}
                    onDateSelect={(date) => console.log("Selected date:", date)} 
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick Stats */}
            <motion.div
              className="bg-white p-4 md:p-5 shadow-md rounded-lg border-t-4 border-teal-500"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Quick Stats
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isRefreshing ? 'refreshing-stats' : 'stats-content'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Bookings:</span>
                    <span className="font-semibold">{bookedRooms.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Occupancy Rate:</span>
                    <span className="font-semibold">
                      {bookedRooms.length ? `${Math.round((bookedRooms.length / 30) * 100)}%` : "0%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${bookedRooms.length ? Math.round((bookedRooms.length / 30) * 100) : 0}%` 
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookedRooms;