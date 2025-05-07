import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, SunDim, Moon, Upload, UserPlus, ChevronDown, Building2, Hotel, CheckCircle2, AlertCircle, AlertTriangle, X, CloudSun } from "lucide-react"; 
import axios from "axios";


const AddStaff = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    jobTitle: "",
    shifts: { morning: false, afternoon: false, night: false },
  });

  const [image, setImage] = useState(null);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isJobTitleOpen, setIsJobTitleOpen] = useState(false);
  const [toast, setToast] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const closeToast = () => setToast(null);

  // Navigate function for breadcrumbs
  const navigate = () => {
    // Navigate to dashboard/previous page when breadcrumb is clicked
    window.history.back(); // This will go to the previous page in browser history
    // If using React Router, you could use history.goBack() or navigate(-1)
    // For specific path navigation: history.push('/dashboard') or navigate('/dashboard')
  };

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
  

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type === "checkbox" ? "shifts" : name]: type === "checkbox" 
        ? { ...prev.shifts, [name]: checked } 
        : value,
    }));
  };

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation checks
    if (!formData.department || !formData.jobTitle) {
      showToast("error", "Please select both department and job title");
      setIsSubmitting(false);
      return;
    }
    
    // Check if at least one shift is selected
    const hasShift = Object.values(formData.shifts).some(value => value);
    if (!hasShift) {
      showToast("error", "Please select at least one shift");
      setIsSubmitting(false);
      return;
    }
    
    const formDataToSend = new FormData();
  
    // Properly append form data for sending to API
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "shifts") {
        // Convert shifts object to JSON string to preserve structure
        formDataToSend.append("shifts", JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });
  
    if (image) {
      formDataToSend.append("profilePic", image);
    }
  
    try {
      // Remove development check to ensure actual API is called
      const response = await axios.post("/api/staff", formDataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 201 || response.status === 200) {
        showToast("success", "Staff Member Added Successfully!");
  
        // Reset the form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          department: "",
          jobTitle: "",
          shifts: { morning: false, afternoon: false, night: false },
        });
        setImage(null);
      } else {
        // Handle non-201/200 responses
        showToast("error", `Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      
      // Extract the most useful error message to display to the user
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Error adding staff member. Please try again.";
      
      showToast("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const Toast = ({ type, message, onClose }) => {
    return (
      <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
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

  // Debug function to view current form data
  const debugFormData = () => {
    console.log("Current form data:", formData);
    console.log("Image:", image);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
      <AnimatePresence>
        {toast && (
          <Toast type={toast.type} message={toast.message} onClose={closeToast} />
        )}
      </AnimatePresence>
      
      {/* Breadcrumbs */}
      <div className="flex items-center mb-8 text-sm">
        <button 
          onClick={() => navigate()}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Add New Staff</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Sidebar Image Section */}
        <div className="relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1554009975-d74653b879f1?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Hotel Staff Management" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-black p-8 text-center">
            <Hotel className="w-24 h-24 mb-6 text-black" />
            <h3 className="text-3xl font-bold mb-4">Hotel Staff Management</h3>
            <p className="text-lg opacity-80">
              Streamline your workforce management with our comprehensive staff addition system
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[900px]">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-semibold text-center text-blue-900 mb-6 flex items-center justify-center"
          >
            <UserPlus className="mr-4 text-blue-700" /> Add New Staff Member
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {["firstName", "lastName"].map((field) => (
                <motion.div 
                  key={field}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {["email", "phone"].map((field) => (
                <motion.div 
                  key={field}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type={field === "email" ? "email" : "tel"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    pattern={field === "phone" ? "[0-9]{10}" : undefined}
                    title={field === "phone" ? "Please enter a valid 10-digit phone number" : undefined}
                  />
                </motion.div>
              ))}
            </div>

            {/* Department and Job Title Dropdowns */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Department Dropdown */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  >
                    <span className="text-sm">
                    {formData.department || "Select Department"}
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
                            onClick={() => {
                              setFormData({ ...formData, department: dept, jobTitle: "" });
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
              </motion.div>

              {/* Job Title Dropdown */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title:</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => formData.department && setIsJobTitleOpen(!isJobTitleOpen)}
                    disabled={!formData.department}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 disabled:opacity-50"
                  >
                    <span className="text-sm">
                    {formData.jobTitle || "Select Job Title"}
                    </span>
                    <ChevronDown className="ml-2 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {isJobTitleOpen && formData.department && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {departments[formData.department].length > 0 ? (
                          departments[formData.department].map((title) => (
                            <button
                              key={title}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, jobTitle: title });
                                setIsJobTitleOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition duration-200"
                            >
                              {title}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No job titles available</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Shifts Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Shifts:</label>
              <div className="flex space-x-6 justify-start">
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
                      checked={formData.shifts[shift]}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <motion.div
                      className="w-12 h-12 border-2 rounded-xl flex items-center justify-center spacebe mb-2"
                      animate={{
                        backgroundColor: formData.shifts[shift] ? "#E5E4E2" : "#FFFFFF",
                        borderColor: formData.shifts[shift] ? "#FFFFFF" : "#9CA3AF",
                      }}
                    >
                      {formData.shifts[shift] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {shift === "morning" ? (
                            <Sun className="text-yellow-500 w-6 h-6" />
                          ) : shift === "afternoon" ? (
                            <CloudSun className="text-orange-500 w-6 h-6" />
                          ) : (
                            <Moon className="text-indigo-500 w-6 h-6" />
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
            </motion.div>

            {/* Profile Picture Upload */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <label className="block text-sm font-medium text-gray-700">Profile Picture:</label>
              <div className="flex items-center space-x-4">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300"
                >
                  <Upload className="mr-2" /> Upload Picture
                </label>
                {image && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Profile"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <span className="text-sm text-gray-600">{image.name}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" /> Add Staff Member
                </>
              )}
            </motion.button>
            
            {/* For development debugging only - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={debugFormData}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Debug Form Data (console)
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddStaff;