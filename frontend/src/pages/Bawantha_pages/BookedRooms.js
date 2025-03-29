import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Bawantha_components/Calendar";
import Header from "../../components/Bawantha_components/Header";
import Sidebar from "../../components/Bawantha_components/Sidebar";
import BookedRoomsFilter from "../../components/Bawantha_components/BookedRoomsFilter";
import BookedRoomsTable from "../../components/Bawantha_components/BookedRoomsTable";
import RoomGrid from "../../components/Bawantha_components/RoomGrid";

const BackgroundSlideshow = () => {
  const images = [
    "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg",
    "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-20.jpg",
    "https://expressinnindia.com/wp-content/uploads/2022/08/JR.-SUITE-BOISAR-1-scaled.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((url, index) => (
        <div
          key={url}
          className={`
            absolute inset-0
            // bg-cover bg-center bg-no-repeat
            transition-opacity duration-1000 ease-in-out
            ${index === currentIndex ? "opacity-80" : "opacity-0"}
          `}
          style={{
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
          }}
        />
      ))}
    </div>
  );
};

const BookedRooms = () => {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const navigate = useNavigate();

  const fetchBookedRooms = () => {
    axios
      .get("http://localhost:5000/api/bookings")
      .then((response) => {
        setBookedRooms(response.data.data);
        setOriginalData(response.data.data);
      })
      .catch((error) => console.error("Error fetching booked rooms:", error));
  };

  useEffect(() => {
    fetchBookedRooms();
  }, []);

  const handleFilter = ({ roomNumber, checkInDate, checkOutDate }) => {
    let filtered = [...originalData];
  
    if (roomNumber.trim()) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(roomNumber.toLowerCase())
      );
    }
  
    if (checkInDate && checkOutDate) {
      const filterStart = new Date(checkInDate);
      const filterEnd = new Date(checkOutDate);
  
      filtered = filtered.filter((booking) => {
        const bookingStart = new Date(booking.checkInDate);
        const bookingEnd = new Date(booking.checkOutDate);
  
        // Check if booking overlaps with filter range
        return bookingStart <= filterEnd && bookingEnd >= filterStart;
      });
    }
  
    setBookedRooms(filtered);
  };
  

  const handleRoomClick = (roomNumber) => {
    const booking = bookedRooms.find((r) => r.roomNumber === roomNumber);
    if (booking) {
      navigate(`/bookings/${booking._id}`);
    } else {
      console.warn("No booking found for room:", roomNumber);
    }
  };

  return (
    <>
      <Header />

      <div className="flex min-h-screen relative">
        <BackgroundSlideshow />
        <Sidebar />

        <div className="flex-1 text-sm pt-20 pl-4 pr-12 relative z-10">
          <div className="bg-white p-2 shadow-md rounded-lg mb-4">
            <BookedRoomsFilter onFilter={handleFilter} />
          </div>

          <div className="flex gap-4">
            <div className="w-3/4 bg-white/95 p-5 shadow-md rounded-lg">
              <BookedRoomsTable
                bookedRooms={bookedRooms}
                refreshBookings={fetchBookedRooms}
              />
            </div>

            <div className="w-1/4 bg-white p-5 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-4">All Rooms</h3>
              <RoomGrid
                rooms={bookedRooms}
                mode="booked"
                bookings={bookedRooms}
                onRoomClick={handleRoomClick}
              />
              <div className="mt-28">
    <h3 className="text-lg font-semibold mb-5">Availability Calendar</h3>
    <Calendar onDateSelect={(date) => console.log("Selected date:", date)} />
  </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookedRooms;
