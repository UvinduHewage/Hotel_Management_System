import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Components
import ReservationHistoryTable from "../../components/Bawantha_components/ReservationHistoryTable";
import jsPDF from "jspdf";

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/booking-history")
      .then((response) => {
        const sortedData = response.data.data.sort(
          (a, b) => b._id.localeCompare(a._id) // Newest bookings first
        );
        setReservations(sortedData);
        setFilteredReservations(sortedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setIsLoading(false);
      });
  };

  // Filter reservations by date range and search query
  const filterReservations = () => {
    let filtered = [...reservations];

    // Filter by date range if both dates are set
    if (startDate && endDate) {
      filtered = filtered.filter((reservation) => {
        const bookedDate = new Date(reservation.bookedDate);
        return (
          bookedDate >= new Date(startDate) && bookedDate <= new Date(endDate)
        );
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation._id.toLowerCase().includes(query) ||
          reservation.customerName.toLowerCase().includes(query) ||
          reservation.roomNumber.toLowerCase().includes(query) ||
          reservation.nic.toLowerCase().includes(query) ||
          reservation.phone.toLowerCase().includes(query)
      );
    }

    setFilteredReservations(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Apply filters with a short delay for better UX
    setTimeout(() => filterReservations(), 300);
  };

  // Function to generate and download report
  const generateReport = () => {
    if (filteredReservations.length === 0) {
      alert("No reservation records available to export.");
      return;
    }

    const doc = new jsPDF();
    const margin = 10;
    const lineHeight = 10;
    const colWidths = [40, 20, 40, 30, 35, 30];
    const padding = 3;

    let y = 20;

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Reservation History Report", margin, y);
    y += 10;

    // Header background
    doc.setFillColor(230, 230, 250);
    doc.rect(margin, y, colWidths.reduce((a, b) => a + b), lineHeight, "F");

    // Column titles
    doc.setFontSize(10);
    doc.setTextColor(0);
    let x = margin;
    const headers = [
      "Booking ID",
      "Room",
      "Customer Name",
      "NIC",
      "Phone",
      "Booked",
    ];
    headers.forEach((text, i) => {
      doc.text(text, x + padding, y + 7);
      x += colWidths[i];
    });

    y += lineHeight;

    filteredReservations.forEach((res, index) => {
      x = margin;

      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(
          margin,
          y,
          colWidths.reduce((a, b) => a + b),
          lineHeight,
          "F"
        );
      }

      const values = [
        res._id.slice(0, 10),
        res.roomNumber,
        res.customerName,
        res.nic,
        res.phone,
        new Date(res.checkInDate).toLocaleDateString(),
      ];

      values.forEach((text, i) => {
        doc.text(String(text), x + padding, y + 7);
        x += colWidths[i];
      });

      y += lineHeight;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(
      `Reservation_History_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div>
      {/* Header with subtle gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-6 px-8 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hotel Management System
        </h1>
        <p className="text-gray-600">Reservation History</p>
      </div>

      <motion.div
        className="container mx-auto px-4 pb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Filter Section with subtle animations */}
        <motion.div
          className="bg-white p-5 shadow-lg rounded-lg mb-6 border-l-4 border-blue-500"
          variants={itemVariants}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-gray-600 text-sm mb-1">Search:</label>
              <input
                type="text"
                placeholder="Search by name, ID, room..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
              <div>
                <label className="block text-gray-600 text-sm mb-1">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
              </div>
              <div className="self-end">
                <motion.button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={filterReservations}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Filter
                </motion.button>
              </div>
            </div>

            <div className="self-end">
              <motion.button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                onClick={generateReport}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Generate Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          variants={itemVariants}
        >
          <div className="bg-white p-4 shadow-lg rounded-lg border-t-4 border-blue-500 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Reservations</h3>
              <p className="text-xl font-bold">{reservations.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 shadow-lg rounded-lg border-t-4 border-purple-500 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Filtered Results</h3>
              <p className="text-xl font-bold">{filteredReservations.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 shadow-lg rounded-lg border-t-4 border-teal-500 flex items-center">
            <div className="bg-teal-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Latest Update</h3>
              <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Reservation Table */}
        <motion.div
          className="bg-white p-6 shadow-lg rounded-lg mb-6"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Reservation Records
            </h2>
            <motion.button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchReservations}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </motion.button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ReservationHistoryTable reservations={filteredReservations} />
          )}
        </motion.div>

        {/* Back Button */}
        <motion.button
          className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ReservationHistory;