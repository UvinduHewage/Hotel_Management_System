
import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BillingPage from "./pages/Dineth_pages/BillingPage";
import PaymentWithStripe from "./components/Dineth_Components/PaymentWithStripe";
import CustomerBill from "./pages/Dineth_pages/CustomerBill";
import AllBillsPage from "./pages/Dineth_pages/AllBillsPage";






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

import "./App.css";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className="app-container">
      {/* <Header onSidebarToggle={handleSidebarToggle} /> */}
      <div className="flex mt-16">
        {/* <Sidebar isVisible={isSidebarVisible} /> */}
        <div className="content flex-1 p-6">
          <Routes>  {/* ✅ No extra <Router>, just Routes */}
            <Route path="/" element={<RoomTable />} />
            <Route path="/payment" element={<PaymentWithStripe />} />
            <Route path="/roomsUI" element={<RoomGallery />} />
            <Route path="/room-details/:roomNumber" element={<RoomDetailsPage />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/rooms/update/:id" element={<UpdateRoom />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/billP" element={<BillingPage />} />
            <Route path="/Cus_bill" element={<CustomerBill />} />
            <Route path="/all-bills" element={<AllBillsPage />} />

            {/* Bawantha Routes..................................................*/}

        <Route path="/bookingHome" element={<AvailableRooms />} /> 
        <Route path="/booked-rooms" element={<BookedRooms />} />
        <Route path="/reservation-history" element={<ReservationHistory />} />
        <Route path="/booking/:roomNumber" element={<BookingPage />} /> 
        <Route path="/bookings/:id" element={<ViewBookingPage />} />\
        <Route path="/bookings/:id/edit" element={<UpdateBookingPage />} /> 

        {/* tharinda Routes..................................................*/}


        <Route path="/" element={<RoomTable />} />

        <Route path="/rooms/:id" element={<RoomDetail />} />

        <Route path="/rooms/update/:id" element={<UpdateRoom />} />

        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/roomsUI" element={<RoomGallery />} />
        <Route path="/room-details/:roomNumber" element={<RoomDetailsPage />} />
          </Routes>
        </div>
      </div>
    </div>


  );
}

export default App;
