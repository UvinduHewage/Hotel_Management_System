import React, { useState } from "react";
import { ChevronLeft, Image, Save, Home, Bed, DollarSign, Box, FileText } from "lucide-react";

const CreateRoom = () => {
  // Simulate the navigate function since we don't have react-router-dom
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };
  
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
      if (value === "" || value.startsWith("R")) {
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
      // Simulation of API call
      console.log("Submitting room data:", roomData);
      navigate("/roomsUI");
    } catch (err) {
      console.error("Creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-6 text-sm">
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Room Management
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Add New Room</span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Home className="mr-3 h-6 w-6" />
              Create New Room
            </h1>
            <p className="text-blue-100 mt-2">Add a new room to your hotel inventory</p>
          </div>
          
          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Number */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Home className="w-4 h-4 mr-2 text-blue-600" />
                    Room Number
                  </label>
                  <div className="relative">
                    <input
                      name="roomNumber"
                      value={roomData.roomNumber}
                      onChange={handleChange}
                      placeholder="R101"
                      className="w-full border border-gray-300 pl-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute right-3 top-3 text-xs text-gray-400">
                      Must start with R
                    </div>
                  </div>
                </div>
                
                {/* Room Type */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Box className="w-4 h-4 mr-2 text-blue-600" />
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={roomData.roomType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Select Room Type</option>
                    <option value="AC">AC</option>
                    <option value="Non AC">Non AC</option>
                  </select>
                </div>
                
                {/* Bed Type */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Bed className="w-4 h-4 mr-2 text-blue-600" />
                    Bed Type
                  </label>
                  <select
                    name="bedType"
                    value={roomData.bedType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Bed Type</option>
                    <option value="King">King</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                  </select>
                </div>
                
                {/* Price */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    Price
                  </label>
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      value={roomData.price}
                      onChange={handleChange}
                      placeholder="LKR"
                      className="w-full border border-gray-300 pl-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-4 top-3 text-gray-500">per night</span>
                  </div>
                </div>
                
                {/* Room Size */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Box className="w-4 h-4 mr-2 text-blue-600" />
                    Room Size
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Small", "Medium", "Large"].map((sizeOption) => (
                      <label 
                        key={sizeOption} 
                        className={`
                          cursor-pointer border rounded-lg px-4 py-3 flex items-center justify-center
                          ${roomData.size === sizeOption 
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-medium" 
                            : "border-gray-300 text-gray-600"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="size"
                          value={sizeOption}
                          checked={roomData.size === sizeOption}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {sizeOption}
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={roomData.description}
                    onChange={handleChange}
                    placeholder="Describe the room features and amenities..."
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                    required
                  />
                </div>
                
                {/* Images */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Image className="w-4 h-4 mr-2 text-blue-600" />
                    Images (comma-separated URLs)
                  </label>
                  <input
                    name="images"
                    value={roomData.images.join(",")}
                    onChange={handleChange}
                    placeholder="https://example.com/img1, https://example.com/img2"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave blank if no images available.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/roomsUI")}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;