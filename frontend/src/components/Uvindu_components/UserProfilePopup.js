import React, { useState, useEffect } from "react";
import { X, Hotel, Mail, Award, Clock, Loader } from "lucide-react";

const UserProfilePopup = ({ user, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [visible, setVisible] = useState(false);

  // Simulate fetching additional user data
  useEffect(() => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Mock extended user data - in a real app, this would be a fetch call
      const extendedData = {
        ...user,
        lastLogin: user.lastLogin || new Date().toISOString(),
        // Add any additional fields you might want to fetch
      };
      
      setUserData(extendedData);
      setIsLoading(false);
      
      // Slight delay before showing content for smoother transition
      setTimeout(() => setVisible(true), 100);
    }, 600); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [user]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);
  
  // Smooth closing animation
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!user) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50 backdrop-blur-0 transition-all duration-300"
      style={{
        backgroundColor: visible ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: visible ? 'blur(8px)' : 'blur(0px)'
      }}
      onClick={handleClose}
    >
      <div 
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-md p-8 relative transition-all duration-500"
        style={{
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.3)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
        >
          <X size={24} />
        </button>
        
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader size={40} className="text-blue-500 animate-spin mb-4" />
            <p className="text-blue-500 font-medium">Loading profile data...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg transition-all duration-500" 
                   style={{ transform: visible ? 'rotate(0deg)' : 'rotate(-15deg)' }}>
                {userData.username ? userData.username.charAt(0).toUpperCase() : "U"}
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" 
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}>
                {userData.username || "User"}
              </h2>
              <div className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full mt-2 font-medium transition-all duration-500"
                   style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: '100ms' }}>
                {userData.role === "admin" ? "Administrator" : "User"}
              </div>
            </div>
            
            <div className="border-t border-blue-100 pt-4">
              {[
                {
                  icon: <Mail size={20} className="text-blue-500 mr-3" />,
                  label: "Email",
                  value: userData.email || "Not provided",
                  delay: 200
                },
                {
                  icon: <Award size={20} className="text-blue-500 mr-3" />,
                  label: "Role",
                  value: userData.role === "admin" ? "Administrator" : "User",
                  delay: 300
                },
                {
                  icon: <Clock size={20} className="text-blue-500 mr-3" />,
                  label: "Last Login",
                  value: new Date(userData.lastLogin).toLocaleString(),
                  delay: 400
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center mb-4 p-3 hover:bg-blue-50 rounded-lg transition-all duration-500"
                  style={{ 
                    opacity: visible ? 1 : 0, 
                    transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                    transitionDelay: `${item.delay}ms`
                  }}
                >
                  {item.icon}
                  <div>
                    <p className="text-sm text-blue-400 font-medium">{item.label}</p>
                    <p className="text-gray-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div 
              className="mt-6 flex justify-center transition-all duration-500"
              style={{ 
                opacity: visible ? 1 : 0, 
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: '500ms'
              }}
            >
              <div className="flex items-center text-blue-500">
                <Hotel size={18} className="mr-2" />
                <span className="font-medium">Grand Horizon Hotel & Resort</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePopup;