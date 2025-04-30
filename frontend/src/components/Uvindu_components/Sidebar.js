import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CheckSquare,
  Grid2x2Check,
  ScanSearch,
  ChartNoAxesGantt,
  NotebookTabs,
  FileClock,
  Database,
  PlusCircle,
  ChevronUp,
  ChevronDown
} from "lucide-react";

const Sidebar = ({ isVisible, userRole }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const scrollRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = React.useState(false);
  const [isAtTop, setIsAtTop] = React.useState(true);
  const [isAtBottom, setIsAtBottom] = React.useState(false);
  
  // Function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Define menu items with role-based access
  const menuItems = [
    { 
      to: "/", 
      icon: <LayoutDashboard size={20} className="flex-shrink-0" />, 
      label: "Dashboard",
      access: ["admin"] // Both user and admin can access
    },
    // Admin only routes
    { 
      to: "/guest-management", 
      icon: <Users size={20} className="flex-shrink-0" />, 
      label: "Guest Dashboard",
      access: ["admin"]
    },
    { 
      to: "/staff/add", 
      icon: <UserPlus size={20} className="flex-shrink-0" />, 
      label: "Add New Staff",
      access: ["admin"]
    },
    { 
      to: "/attendance", 
      icon: <CheckSquare size={20} className="flex-shrink-0" />, 
      label: "Attendance",
      access: ["admin"]
    },
    { 
      to: "/staff", 
      icon: <NotebookTabs size={20} className="flex-shrink-0" />, 
      label: "Staff Management",
      access: ["admin"]
    },
    { 
      to: "/roomsUI", 
      icon: <ScanSearch size={20} className="flex-shrink-0" />, 
      label: "Browse Rooms",
      access: ["user", "admin"] // Both user and admin can access
    },
    { 
      to: "/bookingHome", 
      icon: <Grid2x2Check size={20} className="flex-shrink-0" />, 
      label: "Available Rooms",
      access: ["admin"]
    },
    { 
      to: "/table", 
      icon: <ChartNoAxesGantt size={20} className="flex-shrink-0" />, 
      label: "Room Management",
      access: ["admin"]
    },
    { 
      to: "/create-room", 
      icon: <PlusCircle size={20} className="flex-shrink-0" />, 
      label: "Create Room",
      access: ["admin"]
    },
    { 
      to: "/booked-rooms", 
      icon: <CheckSquare size={20} className="flex-shrink-0" />, 
      label: "Booked Rooms",
      access: ["admin"]
    },
    { 
      to: "/reservation-history", 
      icon: <FileClock size={20} className="flex-shrink-0" />, 
      label: "Reservation History",
      access: ["admin"]
    },
    { 
      to: "/billTable", 
      icon: <FileClock size={20} className="flex-shrink-0" />, 
      label: "All Bills",
      access: ["admin"]
    },
  
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.access.includes(userRole || "user")
  );

  // Check if content exceeds container height
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        setShowScrollButtons(scrollHeight > clientHeight);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filteredMenuItems]);

  // Handle scroll position tracking
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setIsAtTop(scrollTop === 0);
      setIsAtBottom(Math.ceil(scrollTop + clientHeight) >= scrollHeight);
    }
  };

  // Scroll functions
  const scrollUp = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      ref={sidebarRef}
      initial={{ width: 250 }}
      animate={{ 
        width: isVisible ? 250 : 80,
        transition: { duration: 0.3 }
      }}
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-xl z-40 flex flex-col"
    >
      {/* Scroll indicator - top */}
      {showScrollButtons && !isAtTop && (
        <div 
          className="absolute top-0 left-0 right-0 z-10 flex justify-center cursor-pointer bg-gradient-to-b from-white to-transparent h-8"
          onClick={scrollUp}
        >
          <ChevronUp 
            size={20} 
            className="text-blue-600 animate-bounce" 
          />
        </div>
      )}

      {/* Scrollable navigation */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-200 hover:scrollbar-thumb-blue-400"
        style={{ scrollbarWidth: 'thin' }}
      >
        <nav className="py-4">
          <ul>
            {filteredMenuItems.map((item) => (
              <li key={item.to} className="px-3 py-1">
                <Link
                  to={item.to}
                  className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 group
                    ${isActive(item.to) 
                      ? "bg-blue-100 text-blue-700 font-medium shadow-sm" 
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  <div className={`
                    ${isActive(item.to) ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}
                    ${isVisible ? "mr-3" : "mx-auto"}
                    transition-colors duration-200
                  `}>
                    {item.icon}
                  </div>
                  
                  {isVisible && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Scroll indicator - bottom */}
      {showScrollButtons && !isAtBottom && (
        <div 
          className="absolute bottom-0 left-0 right-0 z-10 flex justify-center cursor-pointer bg-gradient-to-t from-white to-transparent h-8"
          onClick={scrollDown}
        >
          <ChevronDown 
            size={20} 
            className="text-blue-600 animate-bounce" 
          />
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;