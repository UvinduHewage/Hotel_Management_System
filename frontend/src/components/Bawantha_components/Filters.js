// Filters.js
import React, { useState } from "react";

const Filters = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [ac, setAc] = useState("All");
  const [bedType, setBedType] = useState("King");

  const handleSearch = () => {
    onFilter({
      searchTerm,
      selectedDate,
      acFilter: ac,
      bedType,
    });
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md w-full">
      {/* Left side: room search, date, AC/Non-AC, bed type */}
      <div className="flex items-center gap-4">
        
        {/* Room Search */}
        <input
          type="text"
          placeholder="Search for a room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none w-60 mr-12"
        />

        {/* Date Picker */}
        <div className="flex items-center mr-12"> 
          <label className="font-medium text-gray-700 mr-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-36"
          />
        </div>

        {/* AC Filter Dropdown */}
        <div className="flex items-center mr-12">
          <label className="font-medium text-gray-700 mr-2">AC Type</label>
          <select
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="All">All</option>
            <option value="AC">AC</option>
            <option value="Non AC">Non AC</option>
          </select>
        </div>

        {/* Bed Type */}
        <div className="flex items-center mr-12">
          <label className="font-medium text-gray-700 mr-2">Bed Type</label>
          <select
            value={bedType}
            onChange={(e) => setBedType(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            
            <option value="King">King</option>
            <option value="All">All</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
          </select>
        </div>
      </div>

      {/* Right side: Search Button */}
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  );
};

export default Filters;
