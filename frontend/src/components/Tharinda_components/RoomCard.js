import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative h-48">
        <img
          src={room.images[0]}
          alt={`Room ${room.roomNumber}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-out transform hover:scale-110"
        />
        <div
          className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full shadow 
          ${room.availability ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {room.availability ? "Available" : "Booked"}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <motion.h2
          className="text-xl font-bold text-gray-800"
          whileHover={{ color: "#3b82f6" }}
          transition={{ duration: 0.3 }}
        >
          Room {room.roomNumber}
        </motion.h2>
        <p className="text-sm text-gray-500">{room.roomType} | {room.bedType} | {room.size}</p>
        <p className="text-lg font-semibold text-blue-600">Rs. {room.price} / night</p>
        <motion.button
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate(`/room-details/${room.roomNumber}`)}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RoomCard;
