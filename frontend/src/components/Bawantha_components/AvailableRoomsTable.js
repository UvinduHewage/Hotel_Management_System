import React from "react";
import { useNavigate } from "react-router-dom";

const AvailableRoomsTable = ({ rooms }) => {
  const navigate = useNavigate();

  // Sort rooms by room number in ascending order, considering the numeric part
  const sortedRooms = rooms.sort((a, b) => {
    const roomNumberA = parseInt(a.roomNumber.slice(1), 10);
    const roomNumberB = parseInt(b.roomNumber.slice(1), 10);
    return roomNumberA - roomNumberB;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="text-center">
            <th className="border p-2 w-1/6">Room</th>
            <th className="border p-2 w-1/6">Room Type</th>
            <th className="border p-2 w-1/6">Bed</th>
            <th className="border p-2 w-1/6">Price (Rs)</th>
            <th className="border p-2 w-1/6">Size</th>
            <th className="border p-2 w-1/6">Booking</th>
          </tr>
        </thead>
        <tbody>
          {sortedRooms.length > 0 ? (
            sortedRooms.map((room) => (
              <tr
                key={room.roomNumber}
                className="text-center cursor-pointer hover:bg-gray-100 transition"
                onClick={() => navigate(`/booking/${room.roomNumber}`)}
              >
                <td className="border p-2">{room.roomNumber}</td>
                <td className="border p-2">{room.roomType}</td>
                <td className="border p-2">{room.bedType}</td>
                <td className="border p-2">{room.price}</td>
                <td className="border p-2">{room.size}</td>

                {/* Booking Button */}
                <td className="border p-2">
                  <button
                    className="bg-green-500 text-white shadow-md rounded-md px-3 py-1 hover:bg-green-600 transition"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      navigate(`/booking/${room.roomNumber}`);
                    }}
                  >
                    Booking
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No rooms available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AvailableRoomsTable;
