import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Image, Save, Home, Bed, DollarSign, Box, FileText } from "lucide-react";

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
    axios.get(`/api/rooms/${id}`)
      .then(res => setRoomData(res.data.data))
      .catch(err => console.error("Error fetching room:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomNumber" && (value === "" || value.startsWith("R"))) {
      setRoomData(prev => ({ ...prev, roomNumber: value }));
    } else if (name === "price" && /^\d*$/.test(value)) {
      setRoomData(prev => ({ ...prev, price: value }));
    } else if (name === "images") {
      setRoomData(prev => ({ ...prev, images: value.split(",").map(url => url.trim()) }));
    } else {
      setRoomData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/rooms/${id}`, roomData);
      navigate("/roomsUI");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6 text-sm">
          <button onClick={() => navigate("/table")} className="text-blue-600 hover:text-blue-800 flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Room Management
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Update Room</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Home className="mr-3 h-6 w-6" />
              Update Room Details
            </h1>
            <p className="text-blue-100 mt-2">Edit the details for room {roomData.roomNumber}</p>
          </div>

          <form className="p-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Number */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Home className="w-4 h-4 mr-2 text-blue-600" /> Room Number
                  </label>
                  <input name="roomNumber" value={roomData.roomNumber} onChange={handleChange} placeholder="R101" className="w-full border border-gray-300 pl-4 py-3 rounded-lg" />
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Box className="w-4 h-4 mr-2 text-blue-600" /> Room Type
                  </label>
                  <select name="roomType" value={roomData.roomType} onChange={handleChange} className="w-full border border-gray-300 px-4 py-3 rounded-lg">
                    <option value="">Select Room Type</option>
                    <option value="AC">AC</option>
                    <option value="Non AC">Non AC</option>
                  </select>
                </div>

                {/* Bed Type */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Bed className="w-4 h-4 mr-2 text-blue-600" /> Bed Type
                  </label>
                  <select name="bedType" value={roomData.bedType} onChange={handleChange} className="w-full border border-gray-300 px-4 py-3 rounded-lg">
                    <option value="">Select Bed Type</option>
                    <option value="King">King</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" /> Price
                  </label>
                  <input name="price" type="number" value={roomData.price} onChange={handleChange} className="w-full border border-gray-300 pl-4 py-3 rounded-lg" placeholder="150" />
                </div>

                {/* Size */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Box className="w-4 h-4 mr-2 text-blue-600" /> Room Size
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Small", "Medium", "Large"].map(size => (
                      <div key={size} onClick={() => setRoomData(prev => ({ ...prev, size }))} className={`cursor-pointer border rounded-lg px-4 py-3 flex items-center justify-center ${roomData.size === size ? "bg-blue-50 border-blue-500 text-blue-700 font-medium" : "border-gray-300 text-gray-600"}`}>
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" /> Description
                  </label>
                  <textarea name="description" value={roomData.description} onChange={handleChange} placeholder="Describe the room..." className="w-full border border-gray-300 px-4 py-3 rounded-lg h-32" />
                </div>

                {/* Images */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Image className="w-4 h-4 mr-2 text-blue-600" /> Images (comma-separated URLs)
                  </label>
                  <input name="images" value={roomData.images.join(",")} onChange={handleChange} placeholder="https://img1.jpg, https://img2.jpg" className="w-full border border-gray-300 px-4 py-3 rounded-lg" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => navigate("/roomsUI")} className="px-6 py-3 rounded-lg border text-gray-700">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                  <Save className="w-4 h-4 mr-2" />
                  Update Room
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;
