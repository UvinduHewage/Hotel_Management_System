import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-48">
        <img
          src={room.images[0]}
          alt={`Room ${room.roomNumber}`}
          className="w-full h-full object-cover"
        />
        <div
  className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full shadow 
    ${!room.availability ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
>
  {!room.availability ? "Available" : "Booked"}
</div>
      </div>

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Room {room.roomNumber}</h2>
        <p className="text-sm text-gray-500">{room.roomType} | {room.bedType} | {room.size}</p>
        <p className="text-lg font-semibold text-blue-600">Rs. {room.price} / night</p>
        <button
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          onClick={() => navigate(`/room-details/${room.roomNumber}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
