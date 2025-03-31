import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    roomNumber: "",
    roomType: "",
    bedType: "",
    price: "",
    size: "",
    description: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "roomNumber") {
      if (value.startsWith("R")) {
        setRoomData((prev) => ({ ...prev, roomNumber: value }));
      }
    } else if (name === "price") {
      if (/^\d*$/.test(value)) {
        setRoomData((prev) => ({ ...prev, price: value }));
      }
    } else if (name === "images") {
      setRoomData((prev) => ({
        ...prev,
        images: value.split(",").map((url) => url.trim()),
      }));
    } else {
      setRoomData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/rooms", roomData);
      navigate("/roomsUI");
    } catch (err) {
      console.error("Creation failed:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Room</h1>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Room Number</label>
              <input
                name="roomNumber"
                value={roomData.roomNumber}
                onChange={handleChange}
                placeholder="Enter room number"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Room Type</label>
              <select
                name="roomType"
                value={roomData.roomType}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Room Type</option>
                <option value="AC">AC</option>
                <option value="Non AC">Non AC</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Bed Type</label>
              <select
                name="bedType"
                value={roomData.bedType}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Bed Type</option>
                <option value="King">King</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Price</label>
              <input
                name="price"
                type="number"
                value={roomData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Room Size</label>
              <select
                name="size"
                value={roomData.size}
                onChange={handleChange}
                placeholder="e.g., 12x14"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={roomData.description}
                onChange={handleChange}
                placeholder="Describe the room"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Images (comma-separated URLs)</label>
              <input
                name="images"
                value={roomData.images.join(",")}
                onChange={handleChange}
                placeholder="https://example.com/img1, https://example.com/img2"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Leave blank if no images.</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;