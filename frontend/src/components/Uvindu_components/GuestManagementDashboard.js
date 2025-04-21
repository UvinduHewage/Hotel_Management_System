import React, { useState, useEffect } from 'react';
import { Users, Bed, Wallet, Megaphone, CalendarCheck, PlusCircle, Activity, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
// Fixed imports - importing default exports correctly
import BookingReport from './pdfReportGuest';
import generateExcelReport from './excelReportGuest';

const GuestManagementDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalGuests: 0,
    availableRooms: 0,
    todaysRevenue: 0,
    todaysBookings: 0,
    occupancyRate: 0,
    averageStayDuration: 0,
  });

  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [recentCheckIns, setRecentCheckIns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsRes, roomsRes, announcementsRes] = await Promise.all([
          axios.get('/api/bookings'),
          axios.get('/api/rooms'),
          axios.get('/api/announcements/today'),
        ]);

        const bookingsData = bookingsRes.data;
        const roomsData = roomsRes.data;
        const announcementsData = announcementsRes.data;

        console.log('Bookings Data:', bookingsData);
        console.log('Rooms Data:', roomsData);
        console.log('Announcements Data:', announcementsData);

        if (bookingsData.success) {
          setBookings(bookingsData.data);

          // Get recent check-ins (last 24 hours)
          const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const recentCheckins = bookingsData.data
            .filter(booking => 
              booking.status === "Checked-in" && 
              new Date(booking.checkInDate) >= last24Hours
            )
            .slice(0, 5);
          setRecentCheckIns(recentCheckins);

          // Calculate today's data
          const today = new Date().toDateString();
          const todayBookings = bookingsData.data.filter(
            (booking) => new Date(booking.checkInDate).toDateString() === today
          );

          // Calculate average stay duration in days
          const avgStayDuration = bookingsData.data.reduce((sum, booking) => {
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);
            const diffTime = Math.abs(checkOut - checkIn);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return sum + diffDays;
          }, 0) / (bookingsData.data.length || 1);

          // Calculate revenue
          const revenueToday = todayBookings.reduce((sum, b) => sum + b.price, 0);

          // Calculate occupancy rate
          const totalRooms = roomsData.success ? roomsData.data.length : 20;
          const occupiedRooms = bookingsData.data.filter(b => 
            b.status === "Checked-in" || b.status === "Booked"
          ).length;
          
          const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

          setRooms(roomsData.success ? roomsData.data : []);
          
          setStats({
            totalGuests: bookingsData.data.length,
            availableRooms: totalRooms - occupiedRooms,
            todaysRevenue: revenueToday,
            todaysBookings: todayBookings.length,
            occupancyRate,
            averageStayDuration: avgStayDuration.toFixed(1),
          });
        }

        if (announcementsData.success) {
          setAnnouncements(announcementsData.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description) return;

    try {
      const res = await axios.post('/api/announcements', newAnnouncement);

      if (res.data.success) {
        setAnnouncements([...announcements, {
          ...newAnnouncement,
          createdAt: new Date()
        }]);
        setNewAnnouncement({ title: '', description: '' });
      }
    } catch (err) {
      console.error('Error adding announcement:', err);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status.toLowerCase() === activeTab;
  });

  const statsConfig = [
    { label: 'Total Guests', icon: Users, value: stats.totalGuests, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Available Rooms', icon: Bed, value: stats.availableRooms, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: "Today's Revenue", icon: Wallet, value: `LKR ${stats.todaysRevenue.toFixed(2)}`, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { label: "Today's Bookings", icon: CalendarCheck, value: stats.todaysBookings, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: "Occupancy Rate", icon: Activity, value: `${stats.occupancyRate}%`, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: "Avg. Stay Duration", icon: Clock, value: `${stats.averageStayDuration} days`, color: 'text-teal-600', bgColor: 'bg-teal-100' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const today = new Date().toISOString().split('T')[0];

  const hotelInfo = {
    hotelName: "Grand Plaza Hotel",
    hotelAddress: "123 Luxury Lane, City Center",
    hotelContact: "+123 456 7890",
    hotelEmail: "info@grandplaza.com"
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <div className="text-sm text-gray-500">
          <Clock className="inline mr-2" size={16} />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        
        {/* Download Buttons */}
        <div className="flex gap-4 my-6">
          <PDFDownloadLink
            document={
              <BookingReport
                bookings={bookings}
                stats={stats}
                startDate={today}
                endDate={today}
                title="Hotel Booking Report"
                {...hotelInfo}
              />
            }
            fileName="Hotel_Booking_Report.pdf"
          >
            {({ loading }) => (
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                {loading ? 'Preparing PDF...' : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    Download PDF Report
                  </>
                )}
              </button>
            )}
          </PDFDownloadLink>
  
          <button
            onClick={() => generateExcelReport(bookings)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm-3-4a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Download Excel Report
          </button>
        </div>
      </motion.div>

      {/* Rest of the component remains unchanged */}
      {/* Dashboard Stats */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8"
      >
        {statsConfig.map(({ label, icon: Icon, value, color, bgColor }, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className={`p-5 rounded-xl shadow-md bg-white border-l-4 ${color} hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center">
              <div className={`${bgColor} p-3 rounded-full mr-4`}>
                <Icon className={`${color}`} size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{label}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-0">
        {/* Announcements Section */}
        <motion.div
          variants={containerVariants}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Recent Announcements */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <Megaphone className="mr-2 text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Recent Announcements</h2>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {announcements.length > 0 ? (
                announcements.map((announcement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <h3 className="font-bold text-gray-800">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{announcement.description}</p>
                    <span className="text-xs text-gray-500 block mt-2">
                      {new Date(announcement.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">No announcements today</p>
              )}
            </div>
          </motion.div>

          {/* Create New Announcement */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <PlusCircle className="mr-2 text-blue-600" size={24} /> Create New Announcement
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Announcement Title"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
              <textarea
                placeholder="Announcement Description"
                className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 transition-all"
                value={newAnnouncement.description}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
              ></textarea>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddAnnouncement}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Announcement
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Check-ins */}
        <motion.div>
          <div className="space-y-3">
            {recentCheckIns.length > 0 ? (
              recentCheckIns.map((checkin, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                    <Users size={16} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">{checkin.customerName}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">Room {checkin.roomNumber}</span>
                      <span className="mr-2">•</span>
                      <span>{new Date(checkin.checkInDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">${checkin.price}</div>
                    <div className="text-xs text-gray-500">{checkin.roomType}</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-5"></p>
            )}
          </div>

          {recentCheckIns.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center"
            >
              View all check-ins <ChevronRight size={16} className="ml-1" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Booking Management */}
      <motion.div variants={itemVariants} className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Management</h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Tabs for filtering bookings */}
          <div className="flex border-b">
            {['all', 'booked', 'checked-in', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Bookings table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.slice(0, 5).map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">#{booking.roomNumber}</div>
                        <div className="text-xs text-gray-500">{booking.roomType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'Booked' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${booking.status === 'Checked-in' ? 'bg-green-100 text-green-800' : ''}
                          ${booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.price}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* View more button */}
          {filteredBookings.length > 5 && (
            <div className="py-3 px-6 bg-gray-50 border-t text-right">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center ml-auto">
                View all bookings <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuestManagementDashboard;