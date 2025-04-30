import React from "react";

const RoomGrid = ({ rooms, onRoomClick, mode = "available" }) => {
  const totalRooms = 15;

  const getRoomStatus = (roomNumber) => {
    const paddedNumber = roomNumber < 10 ? `R0${roomNumber}` : `R${roomNumber}`;
    const room = rooms.find((r) => r.roomNumber === paddedNumber);

    // If mode is booked, reverse color logic
    const isBooked = !!room;
    if (mode === "booked") {
      return isBooked ? "bg-red-500 text-white" : "bg-green-500 text-white";
    } else {
      return isBooked ? "bg-green-500 text-white" : "bg-red-500 text-white";
    }
  };

  return (
    <div className="p-1 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-5 gap-1">
        {[...Array(totalRooms)].map((_, index) => {
          const roomNumber = index + 1;
          const displayNumber = roomNumber < 10 ? `R0${roomNumber}` : `R${roomNumber}`;
          return (
            <button
              key={displayNumber}
              className={`p-2 rounded-lg ${getRoomStatus(roomNumber)} hover:opacity-80`}
              onClick={() => onRoomClick(displayNumber)}
            >
              {displayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoomGrid;
