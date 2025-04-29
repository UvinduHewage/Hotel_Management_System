import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Sidebar from "./components/Uvindu_components/Sidebar";
import Header from "./components/Uvindu_components/Header"; 
import Dashboard from "./components/Uvindu_components/Dashboard";
import StaffList from "./components/Uvindu_components/StaffList";
import AddStaff from "./components/Uvindu_components/AddStaff";
import StaffAttendance from "./components/Uvindu_components/StaffAttendance"; 
import StaffDataExport from "./components/Uvindu_components/staffDataExport"; 
import GuestManagementDashboard from "./components/Uvindu_components/GuestManagementDashboard";
import UpdateStaff from "./components/Uvindu_components/UpdateStaff";
import HomePage from "./components/Uvindu_components/Home";
import Login from "./components/AuthComponents/Login";
import Signup from "./components/AuthComponents/Signup";


import PaymentWithStripe from "./components/Dineth_Components/PaymentWithStripe"; // ✅ Correct Payment Component
import ViewPage from "./pages/Dineth_pages/ViewPage";
import Bills_table from "./pages/Dineth_pages/Bills_table";

import AvailableRooms from "./pages/Bawantha_pages/AvailableRooms";
import BookedRooms from "./pages/Bawantha_pages/BookedRooms";
import ReservationHistory from "./pages/Bawantha_pages/ReservationHistory";
import BookingPage from "./pages/Bawantha_pages/BookingPage"; 
import ViewBookingPage from "./pages/Bawantha_pages/ViewBookingPage";
import UpdateBookingPage from "./pages/Bawantha_pages/UpdateBookingPage";

import RoomGallery from "./pages/Tharinda_pages/RoomGallery";
import RoomDetailsPage from "./pages/Tharinda_pages/RoomDetailsPage";
import RoomTable from "./pages/Tharinda_pages/RoomTable";
import RoomDetail from "./pages/Tharinda_pages/RoomDetail";
import UpdateRoom from "./pages/Tharinda_pages/UpdateRoom";
import CreateRoom from "./pages/Tharinda_pages/CreateRoom";


import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/verify', {
        headers: { 'Authorization': token }
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsAuthenticated(true);
          setCurrentUser({ id: data.userId, role: data.role });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Token verification error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setShowNavigation(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowNavigation(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  const handleEnterSystem = () => {
    setShowNavigation(true);
  };

  const ProtectedRoute = ({ element, requiredRole }) => {
    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (requiredRole && currentUser.role !== requiredRole && requiredRole === 'admin') {
      return <Navigate to="/unauthorized" />;
    }
    return element;
  };

  const Unauthorized = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="mb-4">You don't have permission to access this page.</p>
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go Back
        </button>
      </div>
    </div>
  );

  if (!showNavigation && !isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage onEnterSystem={() => {
            handleEnterSystem();
            window.location.href = '/login';
          }} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && (
          <Header onSidebarToggle={handleSidebarToggle} user={currentUser} onLogout={handleLogout} />
        )}
        <div className={`flex ${isAuthenticated ? 'pt-16' : ''}`}>
          {isAuthenticated && (
            <Sidebar isVisible={isSidebarVisible} userRole={currentUser?.role} />
          )}
          <main className={`content flex-1 p-6 transition-all duration-300 ${
            isAuthenticated && isSidebarVisible ? 'ml-64' : isAuthenticated ? 'ml-20' : ''
          }`}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />

              {/* Admin and User Accessible Routes */}
              <Route path="/roomsUI" element={<ProtectedRoute element={<RoomGallery />} />} />
              <Route path="/room-details/:roomNumber" element={<ProtectedRoute element={<RoomDetailsPage />} />} />
              <Route path="/rooms/:id" element={<ProtectedRoute element={<RoomDetail />} />} />
              <Route path="/payment/:id" element={<ProtectedRoute element={<PaymentWithStripe />} />} />


              {/* Admin only routes */}
              <Route path="/guest-management" element={<ProtectedRoute element={<GuestManagementDashboard />} requiredRole="admin" />} />
              <Route path="/staff" element={<ProtectedRoute element={<StaffList />} requiredRole="admin" />} />
              <Route path="/staff/add" element={<ProtectedRoute element={<AddStaff />} requiredRole="admin" />} />
              <Route path="/attendance" element={<ProtectedRoute element={<StaffAttendance />} requiredRole="admin" />} />
              <Route path="/staff/export" element={<ProtectedRoute element={<StaffDataExport />} requiredRole="admin" />} />
              <Route path="/staff/update/:id" element={<ProtectedRoute element={<UpdateStaff />} requiredRole="admin" />} />
              <Route path="/bookingHome" element={<ProtectedRoute element={<AvailableRooms />} requiredRole="admin" />} />
              <Route path="/booked-rooms" element={<ProtectedRoute element={<BookedRooms />} requiredRole="admin" />} />
              <Route path="/reservation-history" element={<ProtectedRoute element={<ReservationHistory />} requiredRole="admin" />} />
              <Route path="/booking/:roomNumber" element={<ProtectedRoute element={<BookingPage />} requiredRole="admin" />} />
              <Route path="/bookings/:id" element={<ProtectedRoute element={<ViewBookingPage />} requiredRole="admin" />} />
              <Route path="/bookings/:id/edit" element={<ProtectedRoute element={<UpdateBookingPage />} requiredRole="admin" />} />
              <Route path="/table" element={<ProtectedRoute element={<RoomTable />} requiredRole="admin" />} />
              <Route path="/rooms/update/:id" element={<ProtectedRoute element={<UpdateRoom />} requiredRole="admin" />} />
              <Route path="/create-room" element={<ProtectedRoute element={<CreateRoom />} requiredRole="admin" />} />
              <Route path="/bill/:id" element={<ProtectedRoute element={< ViewPage/>} requiredRole="admin" />} />
              <Route path="/billTable" element={<ProtectedRoute element={< Bills_table/>} requiredRole="admin" />} />

              

              {/* Catch all */}
              <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
