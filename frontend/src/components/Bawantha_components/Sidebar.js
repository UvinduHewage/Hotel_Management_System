import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-11 h-[95vh] w-64 bg-gray-900 text-white shadow-lg rounded-r-xl transition-all duration-300">
  
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/"
                className="block py-3 px-6 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-md"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="block py-3 px-6 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-md"
              >
                Available Rooms 
              </Link>
            </li>
            <li>
            <Link to="/booked-rooms" className="block py-3 px-6 text-gray-300 hover:bg-gray-700 transition rounded-md">
              Booked Rooms
            </Link>
            </li>
            <li>
              <Link to="/reservation-history" className="block py-3 px-6 text-gray-300 hover:bg-gray-700 transition rounded-md">
    Reservation History
  </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
