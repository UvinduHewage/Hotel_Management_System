import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateRoom = () => {
  const { id } = useParams();
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

  useEffect(() => {
    axios.get(`http://localhost:5000/api/rooms/${id}`)
      .then((res) => setRoomData(res.data.data))
      .catch((err) => console.error("Error loading room:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "images") {
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
      await axios.put(`http://localhost:5000/api/rooms/${id}`, roomData);
      navigate("/");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://cf.bstatic.com/xdata/images/hotel/max1024x768/634378151.jpg?k=e6fc4dd42a1f5034fa93a27ea781d4a1c829ce24339c455a9899e482391a7940&o=&hp=1')`,
      }}
    >
      <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Update Room Details
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-gray-700 font-medium mb-1">Price (LKR)</label>
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
              <input
                name="size"
                value={roomData.size}
                onChange={handleChange}
                placeholder="e.g., 12x14"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
              Update Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;
