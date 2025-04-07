import React from "react";
import { motion } from "framer-motion";

const RoomGrid = ({ rooms, onRoomClick, mode = "available" }) => {
  const totalRooms = 15;

  const getRoomStatus = (roomNumber) => {
    const paddedNumber = roomNumber < 10 ? `R0${roomNumber}` : `R${roomNumber}`;
    const room = rooms.find((r) => r.roomNumber === paddedNumber);

    // If mode is booked, reverse color logic
    const isBooked = !!room;
    
    // Check if room is checking out today (for yellow status)
    const today = new Date().toISOString().split('T')[0];
    const isCheckingOutToday = room && room.checkOutDate && 
      room.checkOutDate.split('T')[0] === today;
    
    if (mode === "booked") {
      if (isCheckingOutToday) {
        return "bg-yellow-500 text-white";
      }
      return isBooked ? "bg-red-500 text-white" : "bg-green-500 text-white";
    } else {
      return isBooked ? "bg-green-500 text-white" : "bg-red-500 text-white";
    }
  };

  // Get tooltip text based on room status
  const getTooltipText = (roomNumber) => {
    const paddedNumber = roomNumber < 10 ? `R0${roomNumber}` : `R${roomNumber}`;
    const room = rooms.find((r) => r.roomNumber === paddedNumber);
    
    if (!room) return mode === "booked" ? "Available" : "Not Available";
    
    const today = new Date().toISOString().split('T')[0];
    const isCheckingOutToday = room.checkOutDate && 
      room.checkOutDate.split('T')[0] === today;
    
    if (isCheckingOutToday) return "Checking Out Today";
    return mode === "booked" ? "Occupied" : "Available";
  };

  return (
    <div className="p-3 bg-white shadow-md rounded-lg border border-gray-100">
      <div className="grid grid-cols-5 gap-1">
        {[...Array(totalRooms)].map((_, index) => {
          const roomNumber = index + 1;
          const displayNumber = roomNumber < 10 ? `R0${roomNumber}` : `R${roomNumber}`;
          const status = getRoomStatus(roomNumber);
          const tooltip = getTooltipText(roomNumber);
          
          return (
            <motion.div 
              key={displayNumber}
              className="relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                className={`p-2 w-7 h-8 rounded-md ${status} hover:opacity-90 shadow-sm transition-all duration-200 font-medium flex items-center justify-center`}
                onClick={() => onRoomClick(displayNumber)}
              >
                {displayNumber}
              </button>
              <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none transition-opacity z-10">
                {tooltip}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomGrid;