import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaCalendarCheck, FaCalendarTimes, FaVenusMars, FaCreditCard, FaArrowLeft, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const ViewBookingPage = () => {
  const { id } = useParams();
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

  const calculateStayDuration = () => {
    if (!booking) return null;
    
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const stayDuration = calculateStayDuration();
  const totalPrice = stayDuration && booking ? booking.price * stayDuration : null;

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked":
        return {
          bg: "bg-amber-500",
          text: "text-white",
          border: "border-amber-600",
          dot: "bg-amber-400"
        };
      case "Checked In":
        return {
          bg: "bg-green-500",
          text: "text-white",
          border: "border-green-600",
          dot: "bg-green-400"
        };
      case "Checked Out":
        return {
          bg: "bg-blue-500",
          text: "text-white",
          border: "border-blue-600", 
          dot: "bg-blue-400"
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-white",
          border: "border-gray-600",
          dot: "bg-gray-400"
        };
    }
  };

  return (
    <div className="min-h-screen bg-white pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : booking ? (
          <>
            {/* Header with Navigation */}
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Bookings
              </button>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Booking Reference</p>
                <p className="font-mono font-medium text-gray-800">{booking._id?.substring(0, 8).toUpperCase() || "BREF12345"}</p>
              </div>
            </div>

            {/* Booking Status Banner */}
            <div className="mb-8 relative overflow-hidden rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 flex justify-between items-center">
                <div className="text-white">
                  <h1 className="text-2xl font-bold">Booking Details</h1>
                  <p className="text-blue-100 mt-1">
                    <span className="inline-block mr-2">
                      <FaClock className="inline-block mr-1" />
                      {stayDuration} {stayDuration === 1 ? 'night' : 'nights'}
                    </span>
                    <span className="inline-block">
                      <FaMapMarkerAlt className="inline-block mr-1" />
                      Room {booking.roomNumber}
                    </span>
                  </p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className={`
                    px-4 py-2 rounded-full ${getStatusColor(booking.status).bg} 
                    ${getStatusColor(booking.status).text} font-bold text-sm 
                    uppercase tracking-wide border-2 ${getStatusColor(booking.status).border}
                    flex items-center relative
                  `}>
                    {booking.status === "Booked" && (
                      <span className={`absolute -top-1 -right-1 ${getStatusColor(booking.status).dot} rounded-full h-3 w-3 animate-ping`}></span>
                    )}
                    {booking.status}
                  </div>
                  
                  {totalPrice && (
                    <div className="mt-2 text-white bg-blue-900 bg-opacity-50 px-4 py-1 rounded-full">
                      Total: Rs. {totalPrice}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Room Information Panel */}
              <div className="lg:col-span-4 order-2 lg:order-1">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                  <div
                    className="h-48 relative"
                    style={{
                      backgroundImage: `url(${booking.image || "https://source.unsplash.com/800x600/?hotel-room"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{booking.roomType}</h3>
                      <p className="flex items-center">
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">Room {booking.roomNumber}</span>
                        <span>Rs. {booking.price}/night</span>
                      </p>
                    </div>
                  </div>
                
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-2">Stay Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FaCalendarCheck className="text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">From 2:00 PM</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FaCalendarTimes className="text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Check-out</p>
                            <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">Until 12:00 PM</p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-gray-600">Duration</p>
                        <p className="font-medium">{stayDuration} {stayDuration === 1 ? 'night' : 'nights'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Price Breakdown</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-gray-600">Room Rate</p>
                          <p>Rs. {booking.price} × {stayDuration} {stayDuration === 1 ? 'night' : 'nights'}</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
                          <p>Total</p>
                          <p className="text-blue-600">Rs. {totalPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <FaCreditCard className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Payment Status</h3>
                      <p className="text-sm text-blue-600 mb-3">
                        {booking.status === "Checked Out" ? "Payment Completed" : "Payment Pending"}
                      </p>
                      {booking.status !== "Checked Out" && (
                        <button
                          onClick={() => navigate(`/bill/${booking._id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                        >
                          Make Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Guest Information Panel */}
              <div className="lg:col-span-8 order-1 lg:order-2">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Guest Information</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-8 pb-6 border-b border-gray-100">
                      <div className="flex items-center mb-6">
                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Guest Name</p>
                          <p className="text-lg font-semibold">{booking.customerName}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                          <FaEnvelope className="text-blue-600 mt-1 mr-4" />
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium break-all">{booking.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaPhone className="text-blue-600 mt-1 mr-4" />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium">{booking.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaIdCard className="text-blue-600 mt-1 mr-4" />
                          <div>
                            <p className="text-sm text-gray-500">NIC Number</p>
                            <p className="font-medium">{booking.nic}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaVenusMars className="text-blue-600 mt-1 mr-4" />
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">{booking.gender}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Information</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">1</span>
                            <span className="text-gray-600">Check-in time starts at 2:00 PM. Early check-in subject to availability.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">2</span>
                            <span className="text-gray-600">Check-out time is 12:00 PM. Late check-out subject to availability.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">3</span>
                            <span className="text-gray-600">Please present photo identification upon check-in.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors flex items-center justify-center"
                      >
                        <FaArrowLeft className="mr-2" />
                        Back
                      </button>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/edit-booking/${booking._id}`)}
                          className="px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition-colors flex-1 sm:flex-none"
                        >
                          Modify Booking
                        </button>
                        
                        <button
                          onClick={() => navigate(`/bill/${booking._id}`)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex-1 sm:flex-none"
                        >
                          Make Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">Booking not found.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/booked-rooms")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Back to Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookingPage;