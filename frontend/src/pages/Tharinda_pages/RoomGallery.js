import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "../../components/Tharinda_components/RoomCard";
import { motion } from "framer-motion";

const UserRoomGallery = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms/")
      .then((res) => setRooms(res.data.data))
      .catch((err) => console.error("❌ Failed to fetch rooms:", err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex-1 p-12">
        <motion.h1
          className="text-4xl font-bold text-center text-gray-800 mb-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Browse Our Rooms
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {rooms.map((room) => (
            <motion.div
              key={room.roomNumber}
              className="transform hover:scale-105 transition-transform duration-300 ease-out"
              whileHover={{ scale: 1.05 }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserRoomGallery;
