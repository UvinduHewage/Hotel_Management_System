import React, { useEffect } from "react";
import { X, Hotel, Mail, Award, Clock } from "lucide-react";

const UserProfilePopup = ({ user, onClose }) => {
  if (!user) return null;
  
  // Add animation effect when component mounts
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const popup = document.getElementById('profile-popup');
    if (popup) {
      popup.classList.add('animate-popup');
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div 
        id="profile-popup"
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform transition-all duration-300 scale-95 opacity-95 hover:scale-100 hover:opacity-100"
        style={{
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.3)'
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg transform hover:rotate-3 transition-transform duration-300">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {user.username || "User"}
          </h2>
          <div className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full mt-2 font-medium">
            {user.role === "admin" ? "Administrator" : "User"}
          </div>
        </div>
        
        <div className="border-t border-blue-100 pt-4">
          <div className="flex items-center mb-4 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            <Mail size={20} className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-blue-400 font-medium">Email</p>
              <p className="text-gray-700">{user.email || "Not provided"}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-4 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            <Award size={20} className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-blue-400 font-medium">Role</p>
              <p className="text-gray-700">{user.role === "admin" ? "Administrator" : "User"}</p>
            </div>
          </div>
          
          {user.lastLogin && (
            <div className="flex items-center mb-4 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <Clock size={20} className="text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-blue-400 font-medium">Last Login</p>
                <p className="text-gray-700">{new Date(user.lastLogin).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="flex items-center text-blue-500">
            <Hotel size={18} className="mr-2" />
            <span className="font-medium">SuiteNova</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes popup {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-popup {
          animation: popup 0.4s forwards ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfilePopup;