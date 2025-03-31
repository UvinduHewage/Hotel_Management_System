import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AvailableRooms from "./pages/Tharinda_pages/AvailableRooms";
// import BookedRooms from "./pages/Tharinda_pages/BookedRooms";
// import ReservationHistory from "./pages/Tharinda_pages/ReservationHistory";
// import BookingPage from "./pages/Tharinda_pages/BookingPage"; 
// import ViewBookingPage from "./pages/Tharinda_pages/ViewBookingPage";
// import UpdateBookingPage from "./pages/Tharinda_pages/UpdateBookingPage";
import RoomGallery from "./pages/Tharinda_pages/RoomGallery";
import RoomDetailsPage from "./pages/Tharinda_pages/RoomDetailsPage";
import RoomTable from "./pages/Tharinda_pages/RoomTable";
import RoomDetail from "./pages/Tharinda_pages/RoomDetail";
import UpdateRoom from "./pages/Tharinda_pages/UpdateRoom";
import CreateRoom from "./pages/Tharinda_pages/CreateRoom";




function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<AvailableRooms />} /> */}
        {/* <Route path="/booked-rooms" element={<BookedRooms />} />
        <Route path="/reservation-history" element={<ReservationHistory />} />
        <Route path="/booking/:roomNumber" element={<BookingPage />} /> 
        <Route path="/bookings/:id" element={<ViewBookingPage />} />\
        <Route path="/bookings/:id/edit" element={<UpdateBookingPage />} /> */}
        
        <Route path="/roomsUI" element={<RoomGallery />} />
        <Route path="/room-details/:roomNumber" element={<RoomDetailsPage />} />

        <Route path="/" element={<RoomTable />} />

        <Route path="/rooms/:id" element={<RoomDetail />} />

        <Route path="/rooms/update/:id" element={<UpdateRoom />} />

        <Route path="/create-room" element={<CreateRoom />} />
       
        
       

        
      </Routes>
    </Router>
  );
}

export default App;
