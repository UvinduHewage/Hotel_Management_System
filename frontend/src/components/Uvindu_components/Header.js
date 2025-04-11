import React, { useState, useEffect } from "react";
import { Menu, User, LogOut, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserProfilePopup from "./UserProfilePopup"; 

const Header = ({ onSidebarToggle }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update state
    setCurrentUser(null);
    setShowDropdown(false);
    
    // Navigate to homepage instead of login page
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleProfileClick = () => {
    setShowProfilePopup(true);
    setShowDropdown(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md text-gray-800 flex justify-between items-center p-4 z-50 h-16">
        <div className="flex items-center">
          <button 
            onClick={onSidebarToggle} 
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <Menu size={24} />
          </button>
          <div className="text-xl font-semibold">Grand Horizon Hotel & Resort</div>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                  {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <div className="text-sm font-medium hidden sm:block">
                  {currentUser.username || 'User'}
                  <div className="text-xs text-gray-500">
                    {currentUser.role === 'admin' ? 'Administrator' : 'User'}
                  </div>
                </div>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleProfileClick}
                  >
                    Profile
                  </button>
                  {currentUser.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-md transition">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </header>
      
      {showProfilePopup && currentUser && (
        <UserProfilePopup 
          user={currentUser} 
          onClose={() => setShowProfilePopup(false)} 
        />
      )}
    </>
  );
};

export default Header;