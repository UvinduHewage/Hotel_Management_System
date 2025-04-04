import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Uvindu_components/Sidebar";
import Header from "./components/Uvindu_components/Header"; 
import Dashboard from "./components/Uvindu_components/Dashboard";
import StaffList from "./components/Uvindu_components/StaffList";
import AddStaff from "./components/Uvindu_components/AddStaff";
import StaffAttendance from "./components/Uvindu_components/StaffAttendance"; 
import StaffDataExport from "./components/Uvindu_components/staffDataExport"; 
import GuestManagementDashboard from "./components/Uvindu_components/GuestManagementDashboard";
import UpdateStaff from "./components/Uvindu_components/UpdateStaff";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSidebarToggle={handleSidebarToggle} />
      <div className="flex pt-16"> 
        <Sidebar isVisible={isSidebarVisible} />
        <main 
          className={`content flex-1 p-6 transition-all duration-300 ${
            isSidebarVisible ? 'ml-64' : 'ml-20'
          }`}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/guest-management" element={<GuestManagementDashboard />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/staff/add" element={<AddStaff />} />
            <Route path="/attendance" element={<StaffAttendance />} />
            <Route path="/staff/export" element={<StaffDataExport />} />
            <Route path="/staff/update/:id" element={<UpdateStaff />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;