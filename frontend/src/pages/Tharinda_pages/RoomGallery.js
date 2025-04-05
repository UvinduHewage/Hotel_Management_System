// 📁 pages/Tharinda_pages/UserRoomGallery.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "../../components/Tharinda_components/RoomCard";
import Header from "../../components/Tharinda_components/Header";
import Sidebar from "../../components/Tharinda_components/Sidebar";

const UserRoomGallery = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms/")
      .then((res) => setRooms(res.data.data))
      .catch((err) => console.error("❌ Failed to fetch rooms:", err));
  }, []);

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6 text-center">Browse Our Rooms</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.roomNumber} room={room} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoomGallery;
