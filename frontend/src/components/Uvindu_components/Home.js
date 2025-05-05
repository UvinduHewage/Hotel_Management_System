import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Hotel, ChevronRight, Star, Clock, Users, Coffee, UserPlus } from 'lucide-react';

const HomePage = ({ onEnterSystem }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      setShowContent(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleEnterSystem = () => {
    // Trigger the callback to show sidebar and header
    if (onEnterSystem) {
      onEnterSystem();
    }
    // Navigate to login page instead of dashboard
    navigate('/login');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, delay: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { type: 'spring', stiffness: 300 }
    }
  };
  
  const featureCards = [
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />,
      title: "Staff Management",
      description: "Manage your hotel staff with ease"
    },
    {
      icon: <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />,
      title: "Room Bookings",
      description: "Handle reservations and room assignments"
    },
    {
      icon: <Clock className="h-6 w-6 md:h-8 md:w-8 text-green-500" />,
      title: "Real-time Updates",
      description: "Get instant notifications and status changes"
    },
    {
      icon: <Coffee className="h-6 w-6 md:h-8 md:w-8 text-red-500" />,
      title: "Guest Services",
      description: "Track and fulfill guest requests promptly"
    }
  ];
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Loader Animation */}
      {showLoader && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 z-50">
          <motion.div
            animate={{
              rotateY: [0, 360],
              rotateX: [0, 360],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="relative"
          >
            <motion.div 
              className="absolute w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-lg"
              animate={{
                rotateZ: [0, 90],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
            <motion.div 
              className="w-12 h-12 md:w-16 md:h-16 bg-transparent border-4 border-indigo-600 rounded-lg"
              animate={{
                rotateZ: [45, -45],
                scale: [1.2, 1, 1.2]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute mt-24 md:mt-32 text-base md:text-lg font-medium text-gray-600"
          >
            Loading Hotel Management System...
          </motion.p>
        </div>
      )}
      
      {/* Main Content */}
      {showContent && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <div className="flex flex-col items-center justify-center min-h-screen w-full">
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center mb-8 md:mb-16 px-2 w-full">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
                className="inline-block mb-4 md:mb-6"
              >
                <Hotel className="w-14 h-14 md:w-20 md:h-20 text-indigo-600" />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
                Grand Horizon Hotel & Resort
              </motion.h1>
              <motion.p variants={itemVariants} className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 px-2">
                A comprehensive solution to streamline your hotel operations and enhance guest experiences
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnterSystem}
                  className="bg-indigo-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  Enter System <ChevronRight className="ml-1 md:ml-2 w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
                <Link
                  to="/signup"
                  className="px-6 md:px-8 py-2 md:py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition flex items-center justify-center"
                >
                  <UserPlus size={16} className="mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
                  Create Account
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Feature Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl px-4 sm:px-6">
              {featureCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col items-center text-center"
                >
                  <div className="mb-3 md:mb-4 p-2 md:p-3 bg-blue-50 rounded-full">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-gray-800 mb-1 md:mb-2">{card.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-8 md:mt-16 pt-4 md:pt-6 border-t border-gray-200 text-center text-gray-500 text-sm md:text-base"
          >
            <p>&copy; {new Date().getFullYear()} Grand Horizon Hotel & Resort. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      )}
      
      {/* Background Decoration Elements */}
      <div className="hidden sm:block absolute top-10 md:top-20 right-10 md:right-20 w-32 md:w-64 h-32 md:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="hidden sm:block absolute bottom-10 md:bottom-20 left-10 md:left-20 w-32 md:w-64 h-32 md:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="hidden sm:block absolute bottom-20 md:bottom-40 right-20 md:right-40 w-32 md:w-64 h-32 md:h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default HomePage;