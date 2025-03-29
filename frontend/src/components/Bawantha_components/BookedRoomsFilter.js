
import React, { useState } from "react";

const BookedRoomsFilter = ({ onFilter }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const handleSearch = () => {
    onFilter({
      roomNumber,
      checkInDate,
      checkOutDate,
    });
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md w-full">
      {/* Left/Middle Items in one group */}
      <div className="flex items-center gap-4">
        {/* Room Number Search */}
        <input
          type="text"
          placeholder="Search by Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none w-60 mr-12"
        />

        {/* Check-In */}
        <div className="flex items-center gap-1">
          <label className="font-medium text-gray-700">Check-In</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-36 mr-12"
          />
        </div>

        {/* Check-Out */}
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Check-Out</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-36"
          />
        </div>
      </div>

      {/* Search Button on the Right */}
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  );
};

export default BookedRoomsFilter;
