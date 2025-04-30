import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}

      <div className="flex flex-col w-full">
        {/* Header */}
        <Header onSidebarToggle={toggleSidebar} />

        {/* Main Content */}
        <main className={`p-0 pt-20 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
