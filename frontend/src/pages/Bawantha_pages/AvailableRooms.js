import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Bawantha_components/Calendar";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, X, Loader, BedDouble, AlertTriangle, CheckCircle2 } from "lucide-react";

// Components
import AvailableRoomsTable from "../../components/Bawantha_components/AvailableRoomsTable";
import RoomGrid from "../../components/Bawantha_components/RoomGrid";
import Filters from "../../components/Bawantha_components/Filters";

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
      {type === 'success' ? (
        <CheckCircle2 size={24} />
      ) : (
        <AlertTriangle size={24} />
      )}
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
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const roomsResponse = await axios.get("http://localhost:5000/api/rooms");
        const bookingsResponse = await axios.get("http://localhost:5000/api/bookings");
        
        setRooms(roomsResponse.data.data);
        setFilteredRooms(roomsResponse.data.data);
        
        const booked = bookingsResponse.data.data;
        const bookedNumbers = booked.map((b) => b.roomNumber);
        setBookings(booked);
        setBookedRoomNumbers(bookedNumbers);
        showToast('success', 'Room data loaded successfully');
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast('error', 'Failed to load room data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterRooms = ({ searchTerm, selectedDate, acFilter, bedType }) => {
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
  };

  const visibleRooms = filteredRooms.filter(
    (room) => !bookedRoomNumbers.includes(room.roomNumber)
  );

  const handleRoomClick = (roomNumber) => {
    const booking = bookings.find((b) => b.roomNumber === roomNumber);
    if (booking) {
      navigate(`/bookings/${booking._id}`);
    } else {
      console.log("No booking for this room yet.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader size={40} className="mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading room data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast 
            type={toast.type} 
            message={toast.message} 
            onClose={closeToast} 
          />
        )}
      </AnimatePresence>

      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center"
        >
          <Hotel size={36} className="text-blue-600 mr-4" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Room Management</h1>
            <p className="text-gray-600 mt-1">
              View and manage available rooms in your property
            </p>
          </div>
        </motion.div>

        {/* Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-5 shadow-sm rounded-lg border border-gray-200 mb-6"
        >
          <Filters onFilter={filterRooms} />
        </motion.div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Available Rooms Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-3/4 bg-white p-5 shadow-sm rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Available Rooms</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {visibleRooms.length} Rooms
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <AvailableRoomsTable rooms={visibleRooms} />
            </div>
          </motion.div>

          {/* RIGHT: Room Status and Calendar in a column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/4 flex flex-col gap-6"
          >
            {/* Room Status Card */}
            <div className="bg-white p-5 shadow-sm rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <BedDouble size={24} className="text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Room Status</h3>
              </div>
              
              <RoomGrid
                rooms={rooms}
                visibleRooms={visibleRooms}
                mode="available"
                onRoomClick={handleRoomClick}
              />
              
              <div className="flex justify-between text-sm mt-4 text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>

            {/* Calendar Card - Directly below Room Status */}
            <div className="bg-white p-5 shadow-sm rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Availability Calendar</h3>
              <Calendar onDateSelect={(date) => console.log("Selected date:", date)} />
            </div>
          </motion.div>
        </div>
      
      </div>
    </div>
  );
};

export default AvailableRooms;