import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateBookingForm = () => {
  const { id } = useParams(); // Get booking ID from URL
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: "",
    nic: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
    status: "",
  });

  // Fetch the booking details
  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/${id}`)
      .then((response) => {
        setBooking(response.data.data);
        setFormData({
          customerName: response.data.data.customerName,
          nic: response.data.data.nic,
          email: response.data.data.email,
          phone: response.data.data.phone,
          checkInDate: response.data.data.checkInDate.split("T")[0],
          checkOutDate: response.data.data.checkOutDate.split("T")[0],
          status: response.data.data.status,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking:", error);
        setLoading(false);
      });
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/bookings/${id}`, formData)
      .then(() => {
        toast.success("Booking updated successfully!");
        navigate(-1); // Go back after successful update
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
        toast.error("Failed to update booking!");
      });
  };

  if (loading) return <p className="text-center">Loading booking details...</p>;

  if (!booking) return <p className="text-center text-red-500">Booking not found!</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Booking</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="Customer Name" className="p-2 border rounded" />
        <input type="text" name="nic" value={formData.nic} onChange={handleChange} required placeholder="NIC" className="p-2 border rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="p-2 border rounded" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone" className="p-2 border rounded" />
        <label>Check-In Date:</label>
        <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required className="p-2 border rounded" />
        <label>Check-Out Date:</label>
        <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required className="p-2 border rounded" />
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange} required className="p-2 border rounded">
          <option value="Booked">Booked</option>
          <option value="Checked-in">Checked-in</option>
          <option value="Completed">Completed</option>
        </select>
        <div className="flex justify-between">
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Booking</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBookingForm;
