import React, { useState, useEffect, useCallback, Suspense } from "react";
import axios from "axios";
import Calendar from "../../components/Bawantha_components/Calendar";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, X, BedDouble, AlertTriangle, CheckCircle2 } from "lucide-react";

// Components
import AvailableRoomsTable from "../../components/Bawantha_components/AvailableRoomsTable";
import RoomGrid from "../../components/Bawantha_components/RoomGrid";
import Filters from "../../components/Bawantha_components/Filters";
import { useNavigate } from 'react-router-dom';

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
      {type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
      <div className="flex-grow">{message}</div>
      <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1">
        <X size={20} />
      </button>
    </motion.div>
  );
};

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [bookedRoomNumbers, setBookedRoomNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null);
  const [selectedBookedDates, setSelectedBookedDates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [acType, setAcType] = useState('All');
  const [bedType, setBedType] = useState('All');

  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = () => {
    setToast(null);
  };

  // Fetch data with loading states
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use Promise.all to fetch both requests concurrently
      const [roomsResponse, bookingsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/rooms"),
        axios.get("http://localhost:5000/api/bookings")
      ]);
  
      setRooms(roomsResponse.data.data);
      setFilteredRooms(roomsResponse.data.data);
      
      const booked = bookingsResponse.data.data;
      const bookedNumbers = booked.map((b) => b.roomNumber);
      
      setBookedRoomNumbers(bookedNumbers);
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      } else {
        showToast('success', 'Room data updated');
      }
      
      // Reset filters only if explicitly requested (not during initial load)
      if (!isInitialLoad) {
        setSelectedRoomNumber(null);
        setSelectedBookedDates([]);
        setSearchTerm('');
        setSelectedDate('');
        setAcType('All');
        setBedType('All');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast('error', 'Failed to load room data');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialLoad]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterRooms = useCallback(({ searchTerm, selectedDate, acFilter, bedType }) => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (acFilter && acFilter !== "All") {
      filtered = filtered.filter((room) => room.roomType === acFilter);
    }
    if (bedType && bedType !== "All") {
      filtered = filtered.filter((room) => room.bedType === bedType);
    }

    setFilteredRooms(filtered);
    setSelectedRoomNumber(null);
    setSelectedBookedDates([]);
  }, [rooms]);

  useEffect(() => {
    filterRooms({ searchTerm, selectedDate, acFilter: acType, bedType });
  }, [searchTerm, selectedDate, acType, bedType, filterRooms]);

  const visibleRooms = filteredRooms.filter(
    (room) => !bookedRoomNumbers.includes(room.roomNumber)
  );

  const handleRoomClick = (roomNumber) => {
    const isAvailable = visibleRooms.some((r) => r.roomNumber === roomNumber);
  
    if (isAvailable) {
      setSelectedRoomNumber(roomNumber);
      setSelectedBookedDates([]);
    } else {
      navigate('/booked-rooms');
    }
  };

  const displayedRooms = selectedRoomNumber
    ? visibleRooms.filter((room) => room.roomNumber === selectedRoomNumber)
    : visibleRooms;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast type={toast.type} message={toast.message} onClose={closeToast} />
        )}
      </AnimatePresence>

      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex flex-col sm:flex-row sm:items-center"
        >
          <div className="flex items-center mb-3 sm:mb-0">
            <Hotel size={30} className="text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Room Management</h1>
              <p className="text-gray-600 text-sm mt-1">
                View and manage available rooms in your property
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-4 shadow-sm rounded-lg border border-gray-200 mb-6"
        >
          <Filters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            acType={acType}
            setAcType={setAcType}
            bedType={bedType}
            setBedType={setBedType}
            onFilter={filterRooms}
          />
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* LEFT: Available Rooms Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-3/4 bg-white p-4 shadow-sm rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 className="text-xl font-semibold text-gray-800">Available Rooms</h2>
              <div className="flex items-center gap-3">
                {/* Refresh Button with loading indicator */}
                <button
                  className={`px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 ${isLoading ? 'opacity-75' : ''}`}
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Refresh
                </button>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {displayedRooms.length} Rooms
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {/* Use AnimatePresence for smooth transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoading ? 'loading' : 'content'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AvailableRoomsTable rooms={displayedRooms} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT: RoomGrid and Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-1/4 flex flex-col gap-5"
          >
            {/* Room Status */}
            <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <BedDouble size={22} className="text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Room Status</h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoading ? 'loading-grid' : 'grid-content'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RoomGrid
                    rooms={rooms}
                    visibleRooms={visibleRooms}
                    mode="available"
                    onRoomClick={handleRoomClick}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between text-xs md:text-sm mt-4 text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Availability Calendar</h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoading ? 'loading-calendar' : 'calendar-content'}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AvailableRooms;