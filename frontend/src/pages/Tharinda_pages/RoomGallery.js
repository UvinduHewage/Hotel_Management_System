import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "../../components/Tharinda_components/RoomCard";
import { motion, AnimatePresence } from "framer-motion";

const UserRoomGallery = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Staggered animation for room cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        // Add a small delay to ensure loading state is seen when network is very fast
        const response = await axios.get("http://localhost:5000/api/rooms/");
        setRooms(response.data.data);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
        setError("Unable to load rooms. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-gray-200 rounded-lg overflow-hidden shadow-md h-64 animate-pulse">
          <div className="bg-gray-300 h-40 w-full"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error display component
  const ErrorDisplay = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="text-center py-10"
    >
      <div className="text-red-500 text-xl mb-4">
        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {error}
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 relative"
    >
      <div className="flex-1 p-8 md:p-12">
        <motion.h1
          className="text-4xl font-bold text-center text-gray-800 mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Browse Our Rooms
        </motion.h1>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorDisplay />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {rooms.map((room) => (
                <motion.div
                  key={room.roomNumber}
                  variants={itemVariants}
                  className="transform transition-all duration-300 ease-out"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                  }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UserRoomGallery;