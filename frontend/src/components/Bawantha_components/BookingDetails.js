import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BookingDetails = () => {
  const { id } = useParams(); // Get booking ID from URL
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/${id}`)
      .then((response) => {
        setBooking(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center">Loading booking details...</p>;

  if (!booking) return <p className="text-center text-red-500">Booking not found!</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Booking Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Booking ID:</strong> {booking._id}</p>
        <p><strong>Room Number:</strong> {booking.roomNumber}</p>
        <p><strong>Customer Name:</strong> {booking.customerName}</p>
        <p><strong>NIC:</strong> {booking.nic}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>
        <p><strong>Gender:</strong> {booking.gender}</p>
        <p><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${booking.status === "Booked" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>{booking.status}</span></p>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};

export default BookingDetails;
