import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaCalendarCheck, FaCalendarTimes, FaVenusMars } from "react-icons/fa";

const ViewBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleDeleteBooking = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    setShowConfirmation(false);
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      toast.success("Booking deleted successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking!");
    }
  };

  return (
    <>
      <div
        className="flex min-h-screen bg-cover bg-center bg-no-repeat relative "
        style={{
          backgroundImage: `url('https://i1.wp.com/hotel-latour.co.uk/app/app-uploads/2021/11/HLT_reception_Lifestyle1_2500-min.jpg?ssl=1&w=2500&quality=85')`,
        }}
      >
        {/*Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-10"></div>

        <div className="flex-1 p-14 relative z-10 flex justify-center">
          {loading ? (
            <p className="p-6 text-white text-xl font-semibold">Loading booking details...</p>
          ) : booking ? (
            <div className="p-10 bg-white/20 shadow-xl rounded-lg w-3/4 backdrop-blur-md border border-white border-opacity-30 pl-18 mt-8">
              {/* Room Image Header */}
              <div
                className="relative w-full h-72 rounded-lg overflow-hidden shadow-lg"
                style={{
                  backgroundImage: `url(${booking.image || "https://source.unsplash.com/800x600/?hotel-room"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center text-center text-white">
                  <h2 className="text-3xl font-bold">{booking.roomType} - Room {booking.roomNumber}</h2>
                  <p className="text-lg">Rs. {booking.price} per night</p>
                </div>
              </div>

              {/* Customer Details Section */}
              <div className="relative bg-white/60 backdrop-blur-md rounded-lg shadow-lg p-10 mt-8">
                {/* Status Label - Positioned at the top right */}
                <div className="absolute -top-4 -right-4">
                  <span className={`relative px-5 py-2 text-white font-bold uppercase text-sm rounded-full shadow-lg border-2
                    ${booking.status === "Booked" ? "bg-red-500 border-red-700" : "bg-green-500 border-green-700"}
                  `}>
                    {booking.status}
                  </span>
                  {/* Burst Effect for Attention */}
                  {booking.status === "Booked" && (
                    <div className="absolute -top-2 -right-2 bg-red-400 rounded-full h-4 w-4 animate-ping"></div>
                  )}
                </div>

                {/* Customer Details Heading */}
                <h2 className="text-2xl font-bold text-center mb-16 text-gray-900 ">Customer Details</h2>

                {/* Customer Information Grid */}
                <div className="grid grid-cols-2 gap-x-20 gap-y-8 text-gray-800 ml-9 ">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-blue-700 text-xl" />
                    <p><strong>Name:</strong> {booking.customerName}</p>
                  </div>

                  <div className="flex items-center space-x-3 ml-12">
                    <FaIdCard className="text-blue-700 text-xl" />
                    <p><strong>NIC:</strong> {booking.nic}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-700 text-2xl" />
                    <p><strong>Email:</strong> {booking.email}</p>
                  </div>

                 {/* Phone - Shifted Right */}
                  <div className="flex items-center space-x-3 ml-12">
                    <FaPhone className="text-blue-700 text-xl" />
                    <p><strong>Phone:</strong> {booking.phone}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaVenusMars className="text-blue-700 text-xl" />
                    <p><strong>Gender:</strong> {booking.gender}</p>
                  </div>

                  <div className="flex items-center space-x-3 ml-12">
                    <FaCalendarCheck className="text-blue-700 text-xl " />
                    <p><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCalendarTimes className="text-blue-700 text-xl" />
                    <p><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Buttons - Inside the Form, Pushed Further Down */}
                <div className="flex justify-between items-center mt-12 pt-6  ">
                  {/* Back Button - Bottom Left */}
                  <button className="px-5 py-2 rounded-md bg-gray-600 text-white shadow-md hover:bg-gray-700 transition" onClick={() => navigate(-1)}>
                    Back
                  </button>
                  
                  {/* Update & Delete Buttons - Bottom Right */}
                  <div className="space-x-4">
                    <Link to={`/bookings/${booking._id}/edit`}>
                      <button className="px-5 py-2 rounded-md bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition">
                        Update
                      </button>
                    </Link>
                    <button className="px-5 py-2 rounded-md bg-red-500 text-white shadow-md hover:bg-red-600 transition" onClick={handleDeleteBooking}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="p-6 text-white text-xl text-center">Booking not found.</p>
          )}
        </div>
      </div>
       {/* Confirmation Popup */}
       {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this booking? 
            </p>
            <div className="flex flex-row-reverse gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes, Delete Booking
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal
      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-1/3">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this booking?</h3>
            <div className="flex justify-center space-x-4">
              <button onClick={confirmDelete} className="px-5 py-2 rounded-md bg-green-500 text-white shadow-md hover:bg-green-600 transition">
                Confirm
              </button>
              <button onClick={() => setShowConfirmation(false)} className="px-5 py-2 rounded-md bg-red-500 text-white shadow-md hover:bg-red-600 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default ViewBookingPage;
