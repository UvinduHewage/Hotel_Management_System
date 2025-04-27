import React from "react";
import { motion } from "framer-motion";

const RoomGrid = ({ rooms, visibleRooms = [], onRoomClick, mode = "available" }) => {
  const totalRooms = 15;

  const getRoomStatus = (roomNumber) => {
    const paddedNumber = roomNumber < 10 ? `R0${roomNumber}` : `R${roomNumber}`;
    
    const isAvailable = visibleRooms.some((r) => r.roomNumber === paddedNumber);

    if (mode === "available") {
      return isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white";
    } else {
      const room = rooms.find((r) => r.roomNumber === paddedNumber);
      const today = new Date().toISOString().split('T')[0];
      const isCheckingOutToday = room && room.checkOutDate && room.checkOutDate.split('T')[0] === today;
      const isBooked = !!room;

      if (isCheckingOutToday) return "bg-yellow-400 text-white";
      return isBooked ? "bg-red-500 text-white" : "bg-green-400 text-white";
    }
  };

  const getTooltipText = (roomNumber) => {
    const paddedNumber = roomNumber < 10 ? `R0${roomNumber}` : `R${roomNumber}`;
    
    const isAvailable = visibleRooms.some((r) => r.roomNumber === paddedNumber);

    if (mode === "available") {
      return isAvailable ? "Available" : "Booked";
    } else {
      const room = rooms.find((r) => r.roomNumber === paddedNumber);
      const today = new Date().toISOString().split('T')[0];
      const isCheckingOutToday = room && room.checkOutDate && room.checkOutDate.split('T')[0] === today;
  
      if (!room) return "Available";
      if (isCheckingOutToday) return "Checking Out Today";
      return "Occupied";
    }
  };

  return (
    <div className="p-2 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="grid grid-cols-4 gap-1">
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
                className={`p-3 w-11 h-11 rounded-full ${status} shadow-md hover:shadow-lg transition-all font-semibold flex items-center justify-center text-sm`}
                onClick={() => onRoomClick(displayNumber)}
              >
                {displayNumber}
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap z-20">
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
