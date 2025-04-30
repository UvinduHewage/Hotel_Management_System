import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BillEditPage = () => {
  const { id } = useParams(); // bill ID
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bills/${id}`)
      .then(res => {
        setBill(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load bill.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/bills/${id}`, bill);
      alert("✅ Bill updated!");
      navigate("/BillTable");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update bill.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
<div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-200">
  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Bill</h2>

  <div className="space-y-6">
    {/* Customer Name */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
      <input
        name="customerName"
        value={bill.customerName}
        onChange={handleChange}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter full name"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Email</label>
      <input
        name="email"
        value={bill.email}
        onChange={handleChange}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter email"
      />
    </div>

    {/* Phone */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Phone</label>
      <input
        name="phone"
        value={bill.phone}
        onChange={handleChange}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter phone number"
      />
    </div>

    {/* Room Number */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Room Number</label>
      <input
        name="roomNumber"
        value={bill.roomNumber}
        onChange={handleChange}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Room number"
      />
    </div>

    {/* Room Type */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Room Type</label>
      <input
        name="roomType"
        value={bill.roomType}
        onChange={handleChange}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Room type"
      />
    </div>

    {/* Price per Night */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Price Per Night</label>
      <input
        type="number"
        name="pricePerNight"
        value={bill.pricePerNight}
        onChange={handleChange}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="e.g., 150"
      />
    </div>

    {/* Total Amount */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Total Amount</label>
      <input
        type="number"
        name="totalAmount"
        value={bill.totalAmount}
        onChange={handleChange}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="e.g., 450"
      />
    </div>

    {/* Submit */}
    <div className="text-center">
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>

  );
};

export default BillEditPage;
