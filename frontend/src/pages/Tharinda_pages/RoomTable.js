import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

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

  // Pagination handler function
  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate pagination values
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  // Function to generate and download report
  const generateReport = () => {
    if (rooms.length === 0) {
      alert("No room records available to export.");
      return;
    }
  
    const doc = new jsPDF();
    const margin = 10;
    const lineHeight = 10;
    const colWidths = [30, 35, 25, 30, 35]; // Adjust column widths as needed
    const padding = 3;
  
    let y = 20;
  
    // Add header with logo placeholder
    doc.setFillColor(40, 80, 160);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
    
    doc.setFontSize(18);
    doc.setTextColor(255);
    doc.text("Room Details Report", margin, 15);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 25);
    
    y += 20;
  
    // Header background
    doc.setFillColor(230, 230, 250);
    doc.rect(margin, y, colWidths.reduce((a, b) => a + b), lineHeight, "F");
  
    // Column titles
    doc.setFontSize(10);
    doc.setTextColor(0);
    let x = margin;
    const headers = ["Room Number", "Room Type", "Size", "Price", "Bed Type"];
    headers.forEach((text, i) => {
      doc.text(text, x + padding, y + 7);
      x += colWidths[i];
    });
  
    y += lineHeight;

    rooms.forEach((room, index) => {
      x = margin;
  
      // Alternate row colors for better readability
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, colWidths.reduce((a, b) => a + b), lineHeight, "F");
      }
  
      const values = [
        room.roomNumber,
        room.roomType,
        room.size,
        `LKR ${room.price}`,
        room.bedType,
      ];
  
      values.forEach((text, i) => {
        doc.text(String(text), x + padding, y + 7);
        x += colWidths[i];
      });
  
      y += lineHeight;
  
      // Add a new page if current page is full
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    }
  
    doc.save(`Room_Details_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div>
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with subtle animation */}
          <div className="mb-6 border-b pb-4 border-gray-100">
            <div className="transition-all duration-500 ease-in-out transform hover:translate-x-1">
              <h1 className="text-2xl font-semibold text-gray-800">Room Management</h1>
              <p className="text-gray-500 text-sm mt-1">View and manage property accommodations</p>
            </div>
          </div>

          {/* Main Card with shadow transition */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
            {/* Card Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-700">Room Inventory</h2>
              <div className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                Total Rooms: {rooms.length}
              </div>
            </div>

            {/* Search and Controls */}
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by room number"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-64 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-1 top-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded px-3 py-1 text-sm transition-colors duration-200"
                    >
                      Search
                    </button>
                  </div>

                  <button
                    type="button"
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={toggleFilters}
                  >
                    Filter
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={generateReport}
                  >
                    Export Report
                  </button>

                  <button
                    onClick={() => navigate("/create-room")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm hover:shadow flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span>Add Room</span>
                  </button>
                </div>
              </div>

              {/* Filter options - animated slide down */}
              {isFiltering && (
                <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200 animate-fade-in">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => applyFilter("")}
                      className={`px-3 py-1 rounded-full text-sm ${!filterType ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
                    >
                      All Types
                    </button>
                    <button 
                      onClick={() => applyFilter("Standard")}
                      className={`px-3 py-1 rounded-full text-sm ${filterType === "Standard" ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
                    >
                      Standard
                    </button>
                    <button 
                      onClick={() => applyFilter("Deluxe")}
                      className={`px-3 py-1 rounded-full text-sm ${filterType === "Deluxe" ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
                    >
                      Deluxe
                    </button>
                    <button 
                      onClick={() => applyFilter("Suite")}
                      className={`px-3 py-1 rounded-full text-sm ${filterType === "Suite" ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
                    >
                      Suite
                    </button>
                  </div>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {/* Table - only show when not loading */}
              {!loading && (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Type</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {currentRooms.length > 0 ? (
                        currentRooms.map((room) => (
                          <tr
                            key={room._id}
                            className={`hover:bg-blue-50 transition-colors duration-150 ${
                              animateRow === room._id ? 'opacity-50 animate-pulse' : ''
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {room.roomNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium
                                ${room.roomType === 'Deluxe' ? 'bg-purple-100 text-purple-800' : 
                                  room.roomType === 'Suite' ? 'bg-amber-100 text-amber-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {room.roomType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {room.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              LKR {room.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {room.bedType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => navigate(`/rooms/update/${room._id}`)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                  </svg>
                                  Edit
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => handleDelete(room._id)}
                                  className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                          <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                              </svg>
                              <p>No room records found in the system.</p>
                              <button 
                                onClick={fetchRooms}
                                className="mt-3 text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                              >
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

              {/* Pagination - fixed and improved */}
              {!loading && rooms.length > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex justify-between items-center w-full">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePagination('prev')}
                      className={`px-3 py-2 text-sm font-semibold rounded-md ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors duration-200`}
                      disabled={currentPage === 1}
                    >
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                        Previous
                      </div>
                    </button>
              
                    {/* Page Information */}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                      </span>
                      <span className="text-sm text-gray-500 mx-2">|</span>
                      <span className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstRoom + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(indexOfLastRoom, rooms.length)}</span> of{" "}
                        <span className="font-medium">{rooms.length}</span> results
                      </span>
                    </div>
              
                    {/* Next Button */}
                    <button
                      onClick={() => handlePagination('next')}
                      className={`px-3 py-2 text-sm font-semibold rounded-md ${
                        currentPage === totalPages 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors duration-200`}
                      disabled={currentPage === totalPages}
                    >
                      <div className="flex items-center">
                        Next
                        <svg className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
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