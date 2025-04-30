import React, { useState, useEffect } from "react";
import axios from "axios";


import BookedRoomsFilter from "../../components/Bawantha_components/BookedRoomsFilter";
import BookedRoomsTable from "../../components/Dineth_Components/BillingTable";

import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const BookedRooms = () => {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredTableBookings, setFilteredTableBookings] = useState([]);
  

  const location = useLocation();
  const incomingRoomNumber = location.state?.roomNumber || null;

  const fetchBills = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/bills")
      .then((response) => {
        setBookedRooms(response.data.data);
        setOriginalData(response.data.data);
        setFilteredTableBookings(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booked rooms:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    if (incomingRoomNumber && originalData.length > 0) {
      const filtered = originalData.filter((r) => r.roomNumber === incomingRoomNumber);
      if (filtered.length > 0) {
        setFilteredTableBookings(filtered);
        window.history.replaceState({}, document.title); // optional cleanup
      }
    }
  }, [incomingRoomNumber, originalData]);

  // 🆕 Helper function to get dates between check-in and check-out
 

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
  };

 

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-6 px-8 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Payment Mangement Dashboard</h1>  
        {/* <p className="text-gray-600">Bill mangement Dashboard</p> */}
      </div>

      <motion.div
        className="container mx-auto px-4 pb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Filter Section */}
        <motion.div
  className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8 rounded-2xl shadow-lg mb-10"
  variants={itemVariants}
>
  <h2 className="text-2xl font-bold text-gray-700 mb-6 tracking-wide text-center">
    🔎 Find Your Bill
  </h2>

  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <BookedRoomsFilter onFilter={handleFilter} />
  </div>
</motion.div>





        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Table Section */}
          <motion.div
            className="lg:w-3/4 bg-white p-6 shadow-lg rounded-lg"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Saved customer's Bills:
              </h2>
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchBills}
              >
                Refresh
              </motion.button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <BookedRoomsTable
                bookedRooms={filteredTableBookings}
                refreshBookings={fetchBills}
              />
            )}
          </motion.div>

          {/* Sidebar Section */}
          <motion.div className="lg:w-1/4 space-y-6" variants={itemVariants}>
            {/* Room Grid */}
            {/* <div className="bg-white p-5 shadow-lg rounded-lg border-t-4 border-indigo-500">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Room Overview
              </h3>
              <RoomGrid
                rooms={bookedRooms}
                mode="booked"
                bookings={bookedRooms}
                onRoomClick={handleRoomClick}
              /> */}

              {/* Room status legend */}
              {/* <div className="mt-4 flex flex-wrap gap-3">
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
            </div> */}

            {/* Calendar */}
            {/* <div className="bg-white p-5 shadow-lg rounded-lg border-t-4 border-purple-500">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Availability Calendar
              </h3>
              <Calendar 
                selectedDates={selectedBookedDates}
                onDateSelect={(date) => console.log("Selected date:", date)} 
              />
            </div> */}

            {/* Quick Stats */}
            <motion.div
              className="bg-white p-5 shadow-lg rounded-lg border-t-4 border-teal-500"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bills:</span>
                  <span className="font-semibold">{bookedRooms.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Occupancy Rate:</span>
                  <span className="font-semibold">
                    {bookedRooms.length ? `${Math.round((bookedRooms.length / 30) * 100)}%` : "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${bookedRooms.length ? Math.round((bookedRooms.length / 30) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookedRooms;
