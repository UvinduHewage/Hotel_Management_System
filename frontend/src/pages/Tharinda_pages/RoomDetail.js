import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(res.data.data);
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!room) return <div className="p-8 text-red-500">Room not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Room {room.roomNumber}</h1>
      <img
        src={room.images?.length ? room.images[0] : "https://via.placeholder.com/600x300"}
        alt="Room"
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <div className="space-y-2">
        <p><strong>Type:</strong> {room.roomType}</p>
        <p><strong>Bed:</strong> {room.bedType}</p>
        <p><strong>Price:</strong> ${room.price}</p>
        <p><strong>Size:</strong> {room.size} sq ft</p>
        <p><strong>Status:</strong> {room.isBooked ? <span className="text-red-500">Booked</span> : <span className="text-green-500">Available</span>}</p>
        <p><strong>Description:</strong> {room.description}</p>
      </div>
    </div>
  );
};

export default RoomDetail;