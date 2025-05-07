import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [animateRow, setAnimateRow] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data.data);
      setTimeout(() => setLoading(false), 300); 
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    
    setAnimateRow(id);
    
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      setTimeout(() => {
        fetchRooms();
        setAnimateRow(null);
      }, 500);
    } catch (err) {
      console.error("Delete failed:", err);
      setAnimateRow(null);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    if (!search.trim()) {
      return fetchRooms();
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/rooms/number/${search}`
      );
      setTimeout(() => {
        setRooms(res.data.data ? [res.data.data] : []);
        setLoading(false);
      }, 300);
    } catch (err) {
      console.error("Search failed:", err);
      setRooms([]);
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    setIsFiltering(!isFiltering);
  };

  const applyFilter = (type) => {
    setFilterType(type);
    setLoading(true);
    
    if (!type) {
      fetchRooms();
      return;
    }
    
    const filteredRooms = rooms.filter(room => room.roomType === type);
    setTimeout(() => {
      setRooms(filteredRooms);
      setLoading(false);
    }, 300);
  };

  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const generateReport = () => {
    if (rooms.length === 0) {
      alert("No room records available to export.");
      return;
    }
  
    const doc = new jsPDF();
    
    // Hotel-themed PDF report
    doc.setFontSize(18);
    doc.setTextColor(13, 71, 161);
    doc.setFont("helvetica", "bold");
    doc.text("Luxury Haven Hotel", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(81, 81, 81);
    doc.setFont("helvetica", "normal");
    doc.text("Room Inventory Report", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: "center" });
    
    // Table data
    const tableData = rooms.map(room => [
      room.roomNumber,
      room.roomType,
      room.size,
      `LKR ${room.price.toLocaleString()}`,
      room.bedType,
      room.availability ? "Available" : "Occupied"
    ]);
    
    // Styled table
    doc.autoTable({
      head: [['Room #', 'Type', 'Size', 'Price', 'Bed Type', 'Status']],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: [13, 71, 161],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 }
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      doc.text("Confidential - Luxury Haven Hotel", 20, doc.internal.pageSize.height - 10);
    }
  
    doc.save(`LuxuryHaven_Rooms_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Luxury Hotel Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <h1 className="text-2xl font-bold tracking-tight">Luxury Haven</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button className="text-blue-100 hover:text-white transition-colors">Dashboard</button>
              <button className="text-blue-100 hover:text-white transition-colors">Reservations</button>
              <button className="text-white font-medium">Rooms</button>
              <button className="text-blue-100 hover:text-white transition-colors">Guests</button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Room Management</h2>
              <p className="text-gray-600 mt-2">Manage your hotel's room inventory efficiently</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="text-blue-800 font-medium">Total Rooms: <span className="text-blue-600">{rooms.length}</span></span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full w-24"></div>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-semibold text-white">Room Inventory</h3>
              <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => navigate("/create-room")}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span>Add New Room</span>
                </button>
                <button
                  onClick={generateReport}
                  className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Search and Filter Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by room number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      onClick={handleSearch}
                      className="px-4 h-full bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className={`inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      isFiltering
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={toggleFilters}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                    </svg>
                    Filter Rooms
                  </button>
                </div>
              </div>
            </div>

            {/* Filter options */}
            {isFiltering && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100 animate-fade-in">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Filter by Room Type:</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => applyFilter("")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      !filterType 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    All Rooms
                  </button>
                  <button 
                    onClick={() => applyFilter("Standard")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterType === "Standard" 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => applyFilter("Deluxe")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterType === "Deluxe" 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    Deluxe
                  </button>
                  <button 
                    onClick={() => applyFilter("Suite")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterType === "Suite" 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    Suite
                  </button>
                  <button 
                    onClick={() => applyFilter("Family")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterType === "Family" 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    Family
                  </button>
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading room data...</span>
              </div>
            )}

            {/* Room Table */}
            {!loading && (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (LKR)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRooms.length > 0 ? (
                      currentRooms.map((room) => (
                        <tr
                          key={room._id}
                          className={`transition-all duration-150 ${
                            animateRow === room._id 
                              ? 'bg-red-50 opacity-75' 
                              : 'hover:bg-blue-50'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-700 font-medium">#{room.roomNumber}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{room.bedType}</div>
                                <div className="text-sm text-gray-500">{room.size}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              room.roomType === 'Deluxe' 
                                ? 'bg-purple-100 text-purple-800' 
                                : room.roomType === 'Suite' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : room.roomType === 'Family'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                              {room.roomType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {room.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <span className="text-blue-700 font-medium">LKR {room.price.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              room.availability 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {room.availability ? 'Available' : 'Occupied'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => navigate(`/rooms/update/${room._id}`)}
                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(room._id)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                            <button
                              onClick={fetchRooms}
                              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                              </svg>
                              Refresh Data
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && rooms.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePagination('prev')}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePagination('next')}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstRoom + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastRoom, rooms.length)}</span> of{' '}
                      <span className="font-medium">{rooms.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePagination('prev')}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePagination('next')}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="text-lg font-semibold text-gray-800">Luxury Haven</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              © {new Date().getFullYear()} Luxury Haven Hotel Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RoomTable;