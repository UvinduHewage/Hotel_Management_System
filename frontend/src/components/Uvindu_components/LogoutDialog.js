import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Hotel, X } from 'lucide-react';

const LogoutDialog = ({ isOpen, onClose, onConfirm }) => {
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const dialogVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 20 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 25 
      } 
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      y: 20,
      transition: { 
        ease: 'easeOut', 
        duration: 0.2 
      } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div 
            className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden relative z-10 mx-4"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header with blue background */}
            <div className="relative h-24 bg-indigo-600 flex items-center justify-center">
              {/* Hotel Icon - now positioned inside the blue header */}
              <div className="flex items-center justify-center">
                <Hotel className="h-10 w-10 text-white" />
              </div>
              
              {/* Close button */}
              <button 
                onClick={onClose}
                className="absolute top-3 right-3 text-white hover:text-indigo-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 pt-6 pb-6">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                Farewell from Grand Horizon
              </h3>
              
              <p className="text-center text-gray-600">
                Are you sure you want to log out from the Hotel Management System? We look forward to welcoming you back soon.
              </p>
              
              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Confirm Logout
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-2 text-center text-xs text-gray-500 bg-gray-50">
              Grand Horizon Hotel & Resort Management System
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutDialog;