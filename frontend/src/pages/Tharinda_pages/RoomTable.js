import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      return fetchRooms();
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/rooms/number/${search}`
      );
      setRooms(res.data.data ? [res.data.data] : []);
    } catch (err) {
      console.error("Search failed:", err);
      setRooms([]);
    }
  };

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
  
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Room Details Report", margin, y);
    y += 10;
  
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
  
    // Add data rows
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
  
    doc.save(`Room_Details_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-28 bg-cover bg-center bg-no-repeat transition-all duration-700"
             style={{
               backgroundImage: `url('https://www.salamanderdc.com/images/hero/full/LivingRoomReimagined-1920x1200.jpg')`
             }}>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
            {/* Page Title */}
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Room Details
            </h1>

            {/* Top Bar: Search, Filter, Report */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search by room number"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-3 py-2 rounded w-52 focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Search
                </button>
              </div>

              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => alert("Filter by type...")}
              >
                Filter(Type)
              </button>

              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={generateReport}
              >
                Report
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-green-300">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 border-r border-green-300">Room Number</th>
                    <th className="py-3 px-4 border-r border-green-300">Room Type</th>
                    <th className="py-3 px-4 border-r border-green-300">Size</th>
                    <th className="py-3 px-4 border-r border-green-300">Price</th>
                    <th className="py-3 px-4 border-r border-green-300">Bed Type</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr
                        key={room._id}
                        className="border-t border-green-300 hover:bg-green-100"
                      >
                        <td className="py-3 px-4 border-r border-green-300">
                          {room.roomNumber}
                        </td>
                        <td className="py-3 px-4 border-r border-green-300">
                          {room.roomType}
                        </td>
                        <td className="py-3 px-4 border-r border-green-300">
                          {room.size}
                        </td>
                        <td className="py-3 px-4 border-r border-green-300">
                          LKR {room.price}
                        </td>
                        <td className="py-3 px-4 border-r border-green-300">
                          {room.bedType}
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => navigate(`/rooms/update/${room._id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(room._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-500">
                        No rooms available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom: Add New Button */}
            <div className="mt-6">
              <button
                onClick={() => navigate("/create-room")}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-6 py-2 rounded-full"
              >
                Add New
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomTable;