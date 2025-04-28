import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/booking/id/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!booking) {
    return <div className="text-center mt-10 text-red-500">Booking not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Booking Details</h2>

      <div className="p-6 border rounded-lg shadow bg-gray-100">
        {booking.image && (
          <img src={booking.image} alt={booking.roomType} className="w-full h-64 object-cover mb-6" />
        )}
        <div className="space-y-3">
          <p><strong>Room Number:</strong> {booking.roomNumber}</p>
          <p><strong>Room Type:</strong> {booking.roomType}</p>
          <p><strong>Customer Name:</strong> {booking.customerName}</p>
          <p><strong>NIC:</strong> {booking.nic}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Phone:</strong> {booking.phone}</p>
          <p><strong>Gender:</strong> {booking.gender}</p>
          <p><strong>Check-In:</strong> {booking.checkInDate.slice(0, 10)}</p>
          <p><strong>Check-Out:</strong> {booking.checkOutDate.slice(0, 10)}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Price:</strong> ${booking.price.toFixed(2)}</p>
          <p><strong>Booked Date:</strong> {new Date(booking.bookedDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
