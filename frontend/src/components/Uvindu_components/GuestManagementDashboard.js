import React, { useState, useEffect } from 'react';
import { Users, Bed, DollarSign, Megaphone, CalendarCheck, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const HotelManagementDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalGuests: 0,
    availableRooms: 0,
    todaysRevenue: 0,
    todaysBookings: 0,
  });
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        if (data.success) {
          setBookings(data.data);
          const today = new Date();
          const todaysBookings = data.data.filter(
            (booking) => new Date(booking.checkInDate).toDateString() === today.toDateString()
          );
          setStats({
            totalGuests: data.data.length,
            availableRooms: 20 - todaysBookings.length,
            todaysRevenue: todaysBookings.reduce((sum, booking) => sum + booking.price, 0),
            todaysBookings: todaysBookings.length,
          });
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/announcements/today');
        const data = await response.json();
        if (data.success) setAnnouncements(data.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    
    fetchBookings();
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async () => {
    if (newAnnouncement.title && newAnnouncement.description) {
      try {
        const response = await fetch('http://localhost:5000/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnnouncement),
        });
        const data = await response.json();
        if (data.success) {
          setNewAnnouncement({ title: '', description: '' });
          setAnnouncements([...announcements, newAnnouncement]);
        }
      } catch (error) {
        console.error('Error creating announcement:', error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-8 max-w-7xl mx-auto"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-4xl font-extrabold text-gray-800 mb-8 text-center"
      >
        Hotel Management Dashboard
      </motion.h1>

      {/* Key Statistics */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          { icon: Users, label: 'Total Guests', value: stats.totalGuests, color: 'text-blue-600' },
          { icon: Bed, label: 'Available Rooms', value: stats.availableRooms, color: 'text-green-600' },
          { icon: DollarSign, label: "Today's Revenue", value: `$${stats.todaysRevenue.toFixed(2)}`, color: 'text-indigo-600' },
          { icon: CalendarCheck, label: "Today's Bookings", value: stats.todaysBookings, color: 'text-purple-600' },
        ].map(({ icon: Icon, label, value, color }, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl shadow-lg bg-white border-l-4 ${color} transform transition-all duration-300`}
          >
            <div className="flex items-center">
              <Icon className={`mr-4 ${color} text-4xl`} />
              <div>
                <h3 className="text-sm font-medium text-gray-500">{label}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Announcements Section */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Existing Announcements */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 border"
        >
          <div className="flex items-center mb-4">
            <Megaphone className="mr-2 text-blue-600 text-2xl" />
            <h2 className="text-xl font-semibold text-gray-800">Recent Announcements</h2>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {announcements.map((announcement, index) => (
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
                  {new Date().toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add Announcement Form */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 border"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <PlusCircle className="mr-2 text-blue-600" /> Create New Announcement
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
    </motion.div>
  );
};

export default HotelManagementDashboard;