import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Upload, Users, Hotel, Sun, Moon, CheckCircle2, AlertTriangle, X, CloudSun } from "lucide-react";

// Toast Component with smooth animation
const Toast = ({ type, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3
        ${type === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
        }`}
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

const UpdateStaff = () => {
  const { id } = useParams();
  const [staffData, setStaffData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    shifts: { morning: false, afternoon: false, night: false },
    profilePic: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isJobTitleOpen, setIsJobTitleOpen] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  
  // Loading state to show smooth transitions
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const departments = {
    "Front Office": [
      "Front Desk Manager",
      "Receptionist",
      "Guest Service Agent",
      "Concierge",
      "Bellboy",
      "Bellman",
      "Night Auditor",
      "Reservation Agent"
    ],
    Housekeeping: [
      "Housekeeping Manager",
      "Room Attendant",
      "Housekeeping Supervisor",
      "Laundry Attendant",
      "Public Area Cleaner"
    ],
    "Food & Beverage": [
      "F&B Manager",
      "Restaurant Manager",
      "Chef",
      "Waiter",
      "Waitress",
      "Bartender",
      "Kitchen Staff",
      "Banquet Coordinator",
      "Steward"
    ],
    "Sales & Marketing": [
      "Sales Manager",
      "Marketing Manager",
      "Public Relations Manager",
      "Event Coordinator",
      "Digital Marketing Specialist"
    ],
    Accounting: [
      "Finance Manager",
      "Accountant",
      "Payroll Coordinator",
      "Financial Analyst"
    ],
    "Human Resources": [
      "HR Manager",
      "HR Assistant",
      "Recruitment Officer",
      "Training Coordinator"
    ],
    "Maintenance & Engineering": [],
    Security: [
      "Security Manager",
      "Security Guard",
      "Surveillance Officer"
    ],
    IT: [
      "IT Manager",
      "Network Administrator",
      "Systems Support Specialist",
      "IT Technician"
    ],
    "Spa & Recreation": [
      "Spa Manager",
      "Spa Therapist",
      "Fitness Instructor",
      "Pool Attendant"
    ],
    "Purchasing & Supply": [
      "Purchasing Manager",
      "Inventory Control Officer",
      "Procurement Specialist"
    ]
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`/api/staff/${id}`);
        
        // Set data and then mark as loaded with a small delay for smooth transition
        setStaffData(response.data);
        setImagePreview(`/uploads/${response.data.profilePic}`);
        
        // Add a small delay before showing content for smoother transition
        setTimeout(() => {
          setIsDataLoaded(true);
          setLoading(false);
        }, 300);
      } catch (err) {
        setError('Unable to fetch staff data');
        showToastMessage('error', 'Unable to fetch staff data');
        setLoading(false);
      }
    };

    fetchStaffData();
    
    // Close dropdowns when clicking outside
    const handleClickOutside = () => {
      setIsDepartmentOpen(false);
      setIsJobTitleOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [id]);

  const showToastMessage = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setStaffData((prevState) => ({
      ...prevState,
      [type === "checkbox" ? "shifts" : name]: type === "checkbox" 
        ? { ...prevState.shifts, [name]: checked } 
        : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Only set a new image if a file is selected
      setStaffData((prevState) => ({
        ...prevState,
        profilePic: file,
      }));
  
      // Create an object URL for the selected image to show a preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDepartmentClick = (e) => {
    e.stopPropagation();
    setIsDepartmentOpen(!isDepartmentOpen);
    setIsJobTitleOpen(false);
  };

  const handleJobTitleClick = (e) => {
    e.stopPropagation();
    if (staffData.department) {
      setIsJobTitleOpen(!isJobTitleOpen);
      setIsDepartmentOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Add all the staff data to the form data
    Object.entries(staffData).forEach(([key, value]) => {
      if (key === "shifts") {
        // Add shift data in the proper format for the backend
        Object.entries(value).forEach(([shift, isChecked]) =>
          formData.append(`shifts[${shift}]`, isChecked)
        );
      } else if (key !== "profilePic") {
        // Add the regular fields (excluding profilePic)
        formData.append(key, value);
      }
    });
  
    // Add the profile picture if available
    if (staffData.profilePic) {
      formData.append("profilePic", staffData.profilePic);
    }
  
    try {
      setLoading(true);
      const response = await axios.put(`/api/staff/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Check if the response was successful
      if (response.status === 200) {
        showToastMessage('success', 'Staff member updated successfully!');
        setError(""); // Clear any previous errors
        
        // Delay navigation for better user experience
        setTimeout(() => {
          navigate("/staff");
        }, 2000);
      }
    } catch (err) {
      setError("Error updating staff member");
      showToastMessage('error', 'Error updating staff member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Form content with loading states
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["firstName", "lastName"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:
            </label>
            <input
              type="text"
              name={field}
              value={staffData[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            />
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["email", "phone"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type={field === "email" ? "email" : "tel"}
              name={field}
              value={staffData[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            />
          </div>
        ))}
      </div>

      {/* Department and Job Title Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Department Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
          <div className="relative">
            <button
              type="button"
              onClick={handleDepartmentClick}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            >
              <span className="text-sm">
                {staffData.department || "Select Department"}
              </span>
              <ChevronDown className="ml-2 text-gray-500" />
            </button>
            <AnimatePresence>
              {isDepartmentOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {Object.keys(departments).map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStaffData({ 
                          ...staffData, 
                          department: dept, 
                          jobTitle: "" 
                        });
                        setIsDepartmentOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition duration-200"
                    >
                      {dept}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Job Title Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title:</label>
          <div className="relative">
            <button
              type="button"
              onClick={handleJobTitleClick}
              disabled={!staffData.department}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 disabled:opacity-50"
            >
              <span className="text-sm">
                {staffData.jobTitle || "Select Job Title"}
              </span>
              <ChevronDown className="ml-2 text-gray-500" />
            </button>
            <AnimatePresence>
              {isJobTitleOpen && staffData.department && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {(departments[staffData.department] || []).map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStaffData({ ...staffData, jobTitle: title });
                        setIsJobTitleOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition duration-200"
                    >
                      {title}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Shifts Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">Shifts:</label>
        <div className="flex flex-wrap gap-6 justify-start">
          {["morning", "afternoon", "night"].map((shift) => (
            <motion.label 
              key={shift} 
              className="flex flex-col items-center cursor-pointer mb-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                name={shift}
                checked={staffData.shifts[shift]}
                onChange={handleChange}
                className="hidden peer"
              />
              <motion.div
                className="w-12 h-12 border-2 rounded-xl flex items-center justify-center mb-2"
                animate={{
                  backgroundColor: staffData.shifts[shift] ? "#E5E4E2" : "#FFFFFF",
                  borderColor: staffData.shifts[shift] ? "#FFFFFF" : "#9CA3AF",
                }}
              >
                {shift === "morning" ? (
                  <Sun className={`w-6 h-6 ${staffData.shifts[shift] ? "text-yellow-500" : "text-gray-300"}`} />
                ) : shift === "afternoon" ? (
                  <CloudSun className={`w-6 h-6 ${staffData.shifts[shift] ? "text-orange-500" : "text-gray-300"}`} />
                ) : (
                  <Moon className={`w-6 h-6 ${staffData.shifts[shift] ? "text-indigo-500" : "text-gray-300"}`} />
                )}
              </motion.div>
              <span className="text-sm text-gray-700">
                {shift.charAt(0).toUpperCase() + shift.slice(1)}
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Profile Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture:</label>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-600 file:cursor-pointer"
          />
          {imagePreview && (
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={imagePreview} 
              alt="Profile Preview" 
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-300" 
            />
          )}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-70"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>Updating...</span>
          </div>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Update Staff Profile</span>
          </>
        )}
      </motion.button>
    </form>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto bg-gray-50">
      <AnimatePresence>
        {showToast && (
          <Toast 
            type={toastType} 
            message={toastMessage} 
            onClose={() => setShowToast(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Breadcrumbs - Added as requested */}
      <div className="flex items-center mb-8 text-sm">
        <button 
          onClick={() => navigate("/staff")} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Staff Management
        </button>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">
          Update Staff #{id?.substring(0, 8).toUpperCase() || "STF12345"}
        </span>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto grid md:grid-cols-2 gap-6 bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isDataLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 sm:p-6 lg:p-8 space-y-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Update Staff Profile</h2>
          </div>

          {loading && !isDataLoaded ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading staff information...</p>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          ) : (
            renderForm()
          )}
        </motion.div>

        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="hidden md:flex items-center justify-center bg-blue-50 p-8 relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1554009975-d74653b879f1?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Hotel Staff Management" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative text-center z-10">
            <Hotel className="w-20 h-20 text-black mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Update Staff Profile</h3>
            <p className="text-black max-w-sm mx-auto">
              Easily modify and manage staff member details to keep your hotel workforce information up to date.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UpdateStaff;