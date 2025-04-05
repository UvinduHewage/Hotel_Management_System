import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RoomDetailsPage = () => {
  const { roomNumber } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/rooms/number/" + roomNumber)
      .then((res) => setRoom(res.data.data))
      .catch((err) => console.error("Error fetching room:", err));
  }, [roomNumber]);

  if (!room) return <p className="p-6 text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <img src={room.images[0]} alt="Room" className="w-full h-80 object-cover" />

        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">Room {room.roomNumber}</h1>
          <p className="text-gray-600">{room.roomType} | {room.bedType} | {room.size}</p>
          <p className="text-blue-600 font-semibold text-xl">Rs. {room.price} / night</p>

          <div className="mt-4">
            <p><strong>Availability:</strong> {room.availability ? "Available" : "Booked"}</p>
            
          </div>

          <button className="mt-6 bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600">
            Book This Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;