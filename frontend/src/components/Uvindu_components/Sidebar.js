import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CheckSquare
} from "lucide-react";

const Sidebar = ({ isVisible }) => {
  const menuItems = [
    { 
      to: "/", 
      icon: <LayoutDashboard className="mr-3" />, 
      label: "Dashboard" 
    },
    { 
      to: "/guest-management", 
      icon: <Users className="mr-3" />, 
      label: "Guest Dashboard" 
    },
    { 
      to: "/staff", 
      icon: <Users className="mr-3" />, 
      label: "Staff Management" 
    },
    { 
      to: "/staff/add", 
      icon: <UserPlus className="mr-3" />, 
      label: "Add New Staff" 
    },
    { 
      to: "/attendance", 
      icon: <CheckSquare className="mr-3" />, 
      label: "Attendance" 
    },
    { 
      to: "/bookingHome", 
      icon: <CheckSquare className="mr-3" />, 
      label: "Available Rooms" 
    },
    { 
      to: "/roomsUI", 
      icon: <CheckSquare className="mr-3" />, 
      label: "UserView" 
    },
    { 
      to: "/table", 
      icon: <CheckSquare className="mr-3" />, 
      label: "Room Details" 
    },
    { 
      to: "/booked-rooms", 
      icon: <CheckSquare className="mr-3" />, 
      label: "Booked Rooms" 
    },
    { 
      to: "/reservation-history", 
      icon: <CheckSquare className="mr-3" />, 
      label: "Reservation History" 
    }
  ];

  return (
    <motion.div 
      initial={{ width: 250 }}
      animate={{ 
        width: isVisible ? 250 : 80,
        transition: { duration: 0.3 }
      }}
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-xl z-40 overflow-hidden"
    >
      <nav className="mt-8">
        <ul>
          {menuItems.map((item, index) => (
            <li key={item.to} className="relative">
              <Link
                to={item.to}
                className="flex items-center py-3 px-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                {item.icon}
                {isVisible && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { duration: 0.2 }
                    }}
                    className="ml-2"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;