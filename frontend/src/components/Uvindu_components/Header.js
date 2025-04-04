import React from "react";
import { Menu } from "lucide-react";

const Header = ({ onSidebarToggle }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md text-gray-800 flex justify-between items-center p-4 z-50 h-16">
      <div className="flex items-center">
        <button 
          onClick={onSidebarToggle} 
          className="mr-4 hover:bg-gray-100 p-2 rounded-full transition"
        >
          <Menu size={24} />
        </button>
        <div className="text-xl font-semibold">Hotel Management System</div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Add additional header items like notifications, user profile, etc. */}
        <div className="text-sm text-gray-600">Welcome, Admin</div>
      </div>
    </header>
  );
};

export default Header;