import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building, 
  Clock, 
  X,
  Sun,
  Moon,
  CloudSun
} from 'lucide-react';

const StaffPopup = ({ selectedStaff, showPopup, handleClosePopup }) => {
  // Function to render shift status
  const renderShiftStatus = (shifts) => {
    if (!shifts) return "No shift information";

    const shiftDetails = [
      { 
        name: "Morning", 
        key: "morning", 
        icon: <Sun className="text-yellow-500" size={20} />,
        time: "6 AM - 2 PM"
      },
      { 
        name: "Afternoon", 
        key: "afternoon", 
        icon: <CloudSun className="text-orange-500" size={20} />,
        time: "2 PM - 10 PM"
      },
      { 
        name: "Night", 
        key: "night", 
        icon: <Moon className="text-indigo-500" size={20} />,
        time: "10 PM - 6 AM"
      }
    ];

    return (
      <div className="space-y-2">
        {shiftDetails.map((shift) => (
          <div 
            key={shift.key} 
            className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg"
          >
            {shift.icon}
            <div className="flex-grow">
              <p className="font-medium">{shift.name} Shift</p>
              <p className="text-sm text-gray-600">{shift.time}</p>
            </div>
            <span 
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                selectedStaff.shifts[shift.key] 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedStaff.shifts[shift.key] ? "Assigned" : "Not Assigned"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!showPopup || !selectedStaff) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center">
              <User className="mr-3" size={20} />
              Staff Profile
            </h2>
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              onClick={handleClosePopup}
              className="hover:bg-blue-700 p-2 rounded-full transition"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Profile Section */}
          <div className="p-4 overflow-y-auto max-h-[70vh]">
            <div className="flex items-center space-x-4 mb-4">
              {selectedStaff.profilePic ? (
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  src={`/uploads/${selectedStaff.profilePic}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                  N/A
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedStaff.firstName} {selectedStaff.lastName}
                </h3>
                <p className="text-blue-600 font-medium text-sm">
                  {selectedStaff.jobTitle}
                </p>
              </div>
            </div>

            {/* Staff Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Briefcase className="text-blue-500" size={18} />
                <span className="text-gray-700 text-sm">
                  <strong>Department:</strong> {selectedStaff.department}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="text-blue-500" size={18} />
                <span className="text-gray-700 text-sm">
                  <strong>Email:</strong> {selectedStaff.email}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="text-blue-500" size={18} />
                <span className="text-gray-700 text-sm">
                  <strong>Phone:</strong> {selectedStaff.phone}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="text-blue-500" size={18} />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                  ${selectedStaff.status === "Active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"}`}
                >
                  Status: {selectedStaff.status}
                </span>
              </div>
            </div>

            {/* Shift Details */}
            <div className="bg-blue-50 p-3 rounded-lg mt-4 border border-blue-100">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="text-blue-500" size={18} />
                <h3 className="text-base font-semibold text-gray-800">Shift Details</h3>
              </div>
              {renderShiftStatus(selectedStaff.shifts)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StaffPopup;