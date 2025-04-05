import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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



// Bawantha........................................................................



import AvailableRooms from "./pages/Bawantha_pages/AvailableRooms";
import BookedRooms from "./pages/Bawantha_pages/BookedRooms";
import ReservationHistory from "./pages/Bawantha_pages/ReservationHistory";
import BookingPage from "./pages/Bawantha_pages/BookingPage"; 
import ViewBookingPage from "./pages/Bawantha_pages/ViewBookingPage";
import UpdateBookingPage from "./pages/Bawantha_pages/UpdateBookingPage";



// Tharinda........................................................................
import RoomGallery from "./pages/Tharinda_pages/RoomGallery";
import RoomDetailsPage from "./pages/Tharinda_pages/RoomDetailsPage";
import RoomTable from "./pages/Tharinda_pages/RoomTable";
import RoomDetail from "./pages/Tharinda_pages/RoomDetail";
import UpdateRoom from "./pages/Tharinda_pages/UpdateRoom";
import CreateRoom from "./pages/Tharinda_pages/CreateRoom";




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

            {/* Bawantha Routes..................................................*/}

            <Route path="/bookingHome" element={<AvailableRooms />} /> 
            <Route path="/booked-rooms" element={<BookedRooms />} />
            <Route path="/reservation-history" element={<ReservationHistory />} />
            <Route path="/booking/:roomNumber" element={<BookingPage />} /> 
            <Route path="/bookings/:id" element={<ViewBookingPage />} />\
            <Route path="/bookings/:id/edit" element={<UpdateBookingPage />} /> 

            {/* tharinda Routes..................................................*/}
    
    
            <Route path="/table" element={<RoomTable />} />
    
            <Route path="/rooms/:id" element={<RoomDetail />} />
    
            <Route path="/rooms/update/:id" element={<UpdateRoom />} />
    
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/roomsUI" element={<RoomGallery />} />
            <Route path="/room-details/:roomNumber" element={<RoomDetailsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;