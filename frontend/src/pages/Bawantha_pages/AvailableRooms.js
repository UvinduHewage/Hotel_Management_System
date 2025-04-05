import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Bawantha_components/Calendar";


// Components
import AvailableRoomsTable from "../../components/Bawantha_components/AvailableRoomsTable";
import RoomGrid from "../../components/Bawantha_components/RoomGrid";
import Filters from "../../components/Bawantha_components/Filters";

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

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [bookedRoomNumbers, setBookedRoomNumbers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms")
      .then((response) => {
        setRooms(response.data.data);
        setFilteredRooms(response.data.data);
      })
      .catch((error) => console.error("Error fetching rooms:", error));

    axios
      .get("http://localhost:5000/api/bookings")
      .then((response) => {
        const booked = response.data.data;
        const bookedNumbers = booked.map((b) => b.roomNumber);
        setBookings(booked);
        setBookedRoomNumbers(bookedNumbers);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const filterRooms = ({ searchTerm, selectedDate, acFilter, bedType }) => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (acFilter && acFilter !== "All") {
      filtered = filtered.filter((room) => room.roomType === acFilter);
    }
    if (bedType && bedType !== "All") {
      filtered = filtered.filter((room) => room.bedType === bedType);
    }

    setFilteredRooms(filtered);
  };

  const visibleRooms = filteredRooms.filter(
    (room) => !bookedRoomNumbers.includes(room.roomNumber)
  );

  const handleRoomClick = (roomNumber) => {
    const booking = bookings.find((b) => b.roomNumber === roomNumber);
    if (booking) {
      navigate(`/bookings/${booking._id}`);
    } else {
      console.log("No booking for this room yet.");
    }
  };

  return (
    <>

      <div className="flex min-h-screen relative">
        <BackgroundSlideshow />

        <div className="flex-1 text-sm pt-20 pl-4 pr-12 relative z-10">
          <div className="bg-white p-2 shadow-md rounded-lg mb-4">
            <Filters onFilter={filterRooms} />
          </div>

          <div className="flex gap-4">
            <div className="w-3/4 bg-white/95 p-5 shadow-md rounded-lg">
              <AvailableRoomsTable rooms={visibleRooms} />
            </div>

            <div className="w-1/4 bg-white p-5 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">All Rooms</h3>
              <RoomGrid
                rooms={visibleRooms}
                mode="available"
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

export default AvailableRooms;
