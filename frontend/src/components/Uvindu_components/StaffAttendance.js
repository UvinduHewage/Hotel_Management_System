import React, { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, UserCheck, Users, X, CheckCircle2, AlertTriangle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch staff data with better error handling and loading states
  const fetchStaffData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use Promise.race to set a timeout for fetch
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });
      
      const fetchPromise = fetch("/api/staff", {
        // Add cache control to prevent stale data
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const res = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch staff data: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Introduce a small delay for smoother transition from skeleton to real data
      setTimeout(() => {
        setStaff(data);
        const initialAttendance = data.reduce((acc, member) => {
          acc[member._id] = member.status === "Active";
          return acc;
        }, {});
        setAttendance(initialAttendance);
        setIsLoading(false);
      }, 300);
      
    } catch (err) {
      console.error("Staff data fetch error:", err);
      setError(err.message);
      showToast('error', 'Failed to load staff information');
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // Use AbortController for cleanup on unmount
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        await fetchStaffData();
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Fetch error:", err);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [fetchStaffData]);

  const handleAttendanceChange = useCallback((id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const submitAttendance = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Create a visual delay for the button state to give feedback
      const submitPromise = fetch("/api/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendance),
      });
      
      // Ensure submission state shows for at least 500ms for visual feedback
      const [res] = await Promise.all([
        submitPromise,
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
      
      if (!res.ok) {
        throw new Error(`Attendance submission failed: ${res.status}`);
      }
      
      await res.json();
      showToast('success', 'Attendance updated successfully');
    } catch (err) {
      console.error("Submit attendance error:", err);
      showToast('error', `Failed to update attendance`);
    } finally {
      setIsSubmitting(false);
    }
  }, [attendance, showToast]);

  const handleRetry = () => {
    fetchStaffData();
  };

  // Responsive design adjustments
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
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

      <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-200">
        {/* Left Side - Hotel Logo and Title */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex items-center justify-center bg-blue-50 p-6 relative"
        >
          <img 
          src="https://images.unsplash.com/photo-1554009975-d74653b879f1?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Hotel Staff Management" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative text-center z-10">
            <Hotel className="w-16 h-16 md:w-24 md:h-24 text-black mx-auto mb-4 md:mb-6" />
            <h3 className="text-xl md:text-2xl font-semibold text-black mb-2 md:mb-4">Manage Attendance</h3>
            <p className="text-black max-w-sm mx-auto text-sm md:text-base">
              Keep track of staff attendance effortlessly with our efficient monitoring system.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Attendance Section */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-6 flex items-center space-x-4"
          >
            <Users size={32} className="text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Staff Attendance</h1>
          </motion.div>

          {/* Loading, Error, and Content States */}
          {isLoading ? (
            <div className="space-y-3 md:space-y-4 max-h-[350px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 mb-4 md:mb-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-3 md:p-4 rounded-lg animate-pulse"
                >
                  <div className="w-2/3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle size={40} className="text-red-500 mb-4" />
              <p className="text-gray-700 mb-4 text-center">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Staff List */}
              <div className="space-y-3 md:space-y-4 max-h-[350px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 mb-4 md:mb-6 custom-scrollbar">
                {staff.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No staff members found</p>
                ) : (
                  staff.map((member) => (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm">{member.jobTitle}</p>
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
                            w-5 h-5 md:w-6 md:h-6 rounded-md border-2 flex items-center justify-center 
                            ${attendance[member._id] ? 'bg-gray-100 border-gray-300' : 'border-gray-300'}
                          `}
                        >
                          {attendance[member._id] && '✔'}
                        </span>
                      </motion.label>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={submitAttendance}
                disabled={isSubmitting || staff.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center justify-center space-x-2 py-2 md:py-3 rounded-lg 
                  text-white font-semibold transition-all duration-300 
                  ${(isSubmitting || staff.length === 0)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                <>
                <UserCheck size={20} className={isSubmitting ? "opacity-0" : "opacity-100"} />
                <span>{isSubmitting ? "Updating..." : "Upload Attendance"}</span>
              </>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;