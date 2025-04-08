import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Hotel, ChevronRight, Star, Clock, Users, Coffee } from 'lucide-react';

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
    onEnterSystem();
    // Navigate to dashboard
    navigate('/');
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
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Staff Management",
      description: "Manage your hotel staff with ease"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Room Bookings",
      description: "Handle reservations and room assignments"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-500" />,
      title: "Real-time Updates",
      description: "Get instant notifications and status changes"
    },
    {
      icon: <Coffee className="h-8 w-8 text-red-500" />,
      title: "Guest Services",
      description: "Track and fulfill guest requests promptly"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* 3D Loader Animation */}
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center">
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
              className="absolute w-16 h-16 bg-blue-500 rounded-lg"
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
              className="w-16 h-16 bg-transparent border-4 border-indigo-600 rounded-lg"
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
            className="absolute mt-32 text-lg font-medium text-gray-600"
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
          className="container mx-auto px-4 py-16"
        >
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
                className="inline-block mb-6"
              >
                <Hotel className="w-20 h-20 text-indigo-600" />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl font-bold text-gray-800 mb-4">
                Hotel Management System
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                A comprehensive solution to streamline your hotel operations and enhance guest experiences
              </motion.p>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnterSystem}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium flex items-center mx-auto hover:bg-indigo-700 transition-colors"
              >
                Enter System <ChevronRight className="ml-2" />
              </motion.button>
            </motion.div>
            
            {/* Feature Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
              {featureCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
                >
                  <div className="mb-4 p-3 bg-blue-50 rounded-full">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Background Decoration Elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-40 right-40 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;