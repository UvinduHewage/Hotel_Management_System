import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, UserCheck, Save, Users, X, CheckCircle2, AlertTriangle } from "lucide-react";

const Toast = ({ type, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3
        ${type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
        }
      `}
    >
      {type === 'success' ? (
        <CheckCircle2 size={24} />
      ) : (
        <AlertTriangle size={24} />
      )}
      <div className="flex-grow">{message}</div>
      <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1">
        <X size={20} />
      </button>
    </motion.div>
  );
};

const StaffAttendance = () => {
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetch("/api/staff")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch staff data');
        }
        return res.json();
      })
      .then((data) => {
        setStaff(data);
        const initialAttendance = data.reduce((acc, member) => {
          acc[member._id] = member.status === "Active";
          return acc;
        }, {});
        setAttendance(initialAttendance);
      })
      .catch(error => {
        showToast('error', 'Failed to load staff information');
      });
  }, []);

  const handleAttendanceChange = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const submitAttendance = () => {
    setIsSubmitting(true);
    fetch("/api/staff/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendance),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Attendance submission failed');
        }
        return res.json();
      })
      .then(() => {
        showToast('success', 'Attendance updated successfully');
        setIsSubmitting(false);
      })
      .catch((error) => {
        showToast('error', 'Failed to update attendance');
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast 
            type={toast.type} 
            message={toast.message} 
            onClose={closeToast} 
          />
        )}
      </AnimatePresence>

      <div className="w-[900px] mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-2 border border-gray-200">
        {/* Left Side - Hotel Logo and Title */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex items-center justify-center bg-blue-50 p-8 relative"
        >
        <img 
          src="https://images.unsplash.com/photo-1554009975-d74653b879f1?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Hotel Staff Management" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative text-center z-10">
           <Hotel className="w-24 h-24 text-black mx-auto mb-6" />
           <h3 className="text-2xl font-semibold text-black mb-4">Manage Attendance</h3>
           <p className="text-black max-w-sm mx-auto">
           Keep track of staff attendance effortlessly with our efficient monitoring system.
           </p>
        </div>
        </motion.div>

        {/* Right Side - Attendance Section */}
        <div className="p-8 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center space-x-4"
          >
            <Users size={40} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Staff Attendance</h1>
          </motion.div>

          {/* Custom Scrollbar Styling */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 mb-6 custom-scrollbar">
            {staff.map((member) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">{member.jobTitle}</p>
                </div>
                <motion.label 
                  className="flex items-center cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={attendance[member._id] || false}
                    onChange={() => handleAttendanceChange(member._id)}
                    className="hidden"
                  />
                  <span 
                    className={`
                      w-6 h-6 rounded-md border-2 flex items-center justify-center 
                      ${attendance[member._id] ? 'bg-gray-100 border-gray-300' : 'border-gray-300'}
                    `}
                  >
                    {attendance[member._id] && '✔'}
                  </span>
                </motion.label>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={submitAttendance}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-full flex items-center justify-center space-x-2 py-3 rounded-lg 
              text-white font-semibold transition-all duration-300 
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? (
              <div className="animate-spin">
                <Save size={20} />
              </div>
            ) : (
              <>
                <UserCheck size={20} />
                <span>Upload Attendance</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;