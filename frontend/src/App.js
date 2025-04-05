import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AvailableRooms from "./pages/Bawantha_pages/AvailableRooms";
import BookedRooms from "./pages/Bawantha_pages/BookedRooms";
import ReservationHistory from "./pages/Bawantha_pages/ReservationHistory";
import BookingPage from "./pages/Bawantha_pages/BookingPage"; 
import ViewBookingPage from "./pages/Bawantha_pages/ViewBookingPage";
import UpdateBookingPage from "./pages/Bawantha_pages/UpdateBookingPage";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AvailableRooms />} />
        <Route path="/booked-rooms" element={<BookedRooms />} />
        <Route path="/reservation-history" element={<ReservationHistory />} />
        <Route path="/booking/:roomNumber" element={<BookingPage />} /> 
        <Route path="/bookings/:id" element={<ViewBookingPage />} />\
        <Route path="/bookings/:id/edit" element={<UpdateBookingPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
