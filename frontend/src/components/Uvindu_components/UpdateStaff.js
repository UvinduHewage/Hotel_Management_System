import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Upload, UserPlus, Hotel, Users, Sun, SunDim, Moon } from "lucide-react";



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

  const departments = {
    "Front Office": ["Receptionist", "Guest Service Agent", "Concierge"],
    Housekeeping: ["Housekeeping Manager", "Room Attendant"],
    "Food & Beverage": ["F&B Manager", "Chef", "Waiter", "Bartender"],
    Security: ["Security Manager", "Security Guard"],
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/staff/${id}`);
        setStaffData(response.data);
        setImagePreview(`http://localhost:5000/uploads/${response.data.profilePic}`);
      } catch (err) {
        setError('Unable to fetch staff data');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [id]);

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
    setStaffData((prevState) => ({
      ...prevState,
      profilePic: file
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.entries(staffData).forEach(([key, value]) => {
      if (key === "shifts") {
        Object.entries(value).forEach(([shift, isChecked]) => 
          formData.append(`shifts[${shift}]`, isChecked)
        );
      } else {
        formData.append(key, value);
      }
    });

    if (staffData.profilePic) formData.append('profilePic', staffData.profilePic);

    try {
      await axios.put(`http://localhost:5000/api/staff/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/staff');
    } catch (err) {
      setError('Error updating staff member');
      console.error(err);
    }
  };

  return (
    <div >
      <div className="container mx-auto grid md:grid-cols-2 gap-8 bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 space-y-6"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Users className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Update Staff Profile</h2>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
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
              <div className="grid md:grid-cols-2 gap-4">
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
              <div className="grid md:grid-cols-2 gap-4">
                {/* Department Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
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
                          className="absolute z-10 left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
                        >
                          {Object.keys(departments).map((dept) => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => {
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
                      onClick={() => setIsJobTitleOpen(!isJobTitleOpen)}
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
                          className="absolute z-10 left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
                        >
                          {(departments[staffData.department] || []).map((title) => (
                            <button
                              key={title}
                              type="button"
                              onClick={() => {
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shifts:</label>
                <div className="flex space-x-6 justify-center">
                  {["morning", "afternoon", "night"].map((shift) => (
                    <motion.label 
                      key={shift} 
                      className="flex flex-col items-center cursor-pointer"
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
                        className="w-16 h-16 border-2 rounded-xl flex items-center justify-center mb-2"
                        animate={{
                          backgroundColor: staffData.shifts[shift] ? "#2563EB" : "#ffffff",
                          borderColor: staffData.shifts[shift] ? "#1E3A8A" : "#9CA3AF",
                        }}
                      >
                        {staffData.shifts[shift] && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {shift === "morning" ? (
                              <Sun className="text-yellow-300 w-8 h-8" />
                            ) : shift === "afternoon" ? (
                              <SunDim className="text-orange-300 w-8 h-8" />
                            ) : (
                              <Moon className="text-indigo-300 w-8 h-8" />
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                      <span className="text-sm text-gray-700">
                        {shift.charAt(0).toUpperCase() + shift.slice(1)}
                      </span>
                    </motion.label>
                  ))}
                  </div>
                </div>

              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture:</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-600"
                  />
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Profile Preview" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-300" 
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Update Staff Profile</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* Image Section */}
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
           <Hotel className="w-24 h-24 text-blue-600 mx-auto mb-6" />
           <h3 className="text-2xl font-semibold text-gray-800 mb-4">Update Staff Profile</h3>
           <p className="text-gray-600 max-w-sm mx-auto">
           Easily modify and manage staff member details to keep your hotel workforce information up to date.
           </p>
        </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default UpdateStaff;