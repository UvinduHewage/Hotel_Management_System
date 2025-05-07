import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingPage = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nic: "",
    phone: "",
    gender: "Male",
    checkInDate: "",
    checkOutDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/rooms")
      .then((response) => {
        if (response.data.success) {
          const room = response.data.data.find(r => r.roomNumber === roomNumber);
          setRoomDetails(room || null);
        } else {
          setRoomDetails(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching room summary:", error);
        setRoomDetails(null);
        setLoading(false);
      });
  }, [roomNumber]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^(071|075|078|077|074)\d{7}$/;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.nic.trim()) errors.nic = "NIC is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.checkInDate) errors.checkInDate = "Check-in Date is required";
    if (!formData.checkOutDate) errors.checkOutDate = "Check-out Date is required";

    if (formData.firstName && !nameRegex.test(formData.firstName.trim())) errors.firstName = "Only letters allowed";
    if (formData.lastName && !nameRegex.test(formData.lastName.trim())) errors.lastName = "Only letters allowed";
    if (formData.phone && !phoneRegex.test(formData.phone.trim())) {
      errors.phone = "Phone number must start with 071, 075, 078, 077, or 074 and have exactly 10 digits";
    }
  
    if (formData.checkInDate && new Date(formData.checkInDate) < today) errors.checkInDate = "Date can't be in past";
    if (formData.checkOutDate && new Date(formData.checkOutDate) < today) errors.checkOutDate = "Date can't be in past";

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    if (checkIn >= checkOut) errors.checkOutDate = "Check-out must be after check-in";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setShowConfirmation(false);

      const bookingData = {
        roomNumber: roomDetails.roomNumber,
        roomType: roomDetails.roomType,
        price: roomDetails.price,
        image: roomDetails.images?.[0],
        customerName: `${formData.firstName} ${formData.lastName}`,
        nic: formData.nic,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
      };

      await axios.post("http://localhost:5000/api/bookings", bookingData);
      await axios.put(`http://localhost:5000/api/rooms/${roomDetails.roomNumber}/book`, { availability: false });

      toast.success("Booking Confirmed!");
      
      setTimeout(() => navigate("/booked-rooms"), 1500);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed. Try again.");
    }
  };

  const calculateStayDuration = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return null;
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    if (checkIn >= checkOut) return null;
    
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const stayDuration = calculateStayDuration();
  const totalPrice = stayDuration && roomDetails ? roomDetails.price * stayDuration : null;

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : roomDetails ? (
          <div className="max-w-7xl mx-auto pt-4 pb-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section - Made more compact on mobile */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl overflow-hidden shadow-xl mb-6 sm:mb-10">
              <div className="h-48 sm:h-64 relative">
                <img 
                  src={roomDetails.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} 
                  alt={roomDetails.roomType} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 sm:p-6">
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
                    {roomDetails.roomType}
                  </h1>
                  <p className="text-base sm:text-xl mb-2 sm:mb-4">Room {roomDetails.roomNumber}</p>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-yellow-300">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="mt-2 sm:mt-4 bg-white text-blue-800 px-4 py-1 sm:px-6 sm:py-2 rounded-full font-bold text-sm sm:text-xl">
                    Rs. {roomDetails.price} per night
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
              {/* Form Section - Improved mobile spacing */}
              <div className="lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Guest Information</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Please fill in your details to complete your booking</p>
                </div>
                
                <form onSubmit={handleBookNow} className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b pb-2">Personal Details</h3>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name*</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-base sm:text-lg font-medium text-gray-800 border-b pb-2">Contact & Identification</h3>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="07XXXXXXXX"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">NIC Number*</label>
                        <input
                          type="text"
                          name="nic"
                          value={formData.nic}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="Enter NIC"
                        />
                        {errors.nic && <p className="text-red-500 text-xs mt-1">{errors.nic}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Check-In Date*</label>
                        <input
                          type="date"
                          name="checkInDate"
                          value={formData.checkInDate}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                        {errors.checkInDate && <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Check-Out Date*</label>
                        <input
                          type="date"
                          name="checkOutDate"
                          value={formData.checkOutDate}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                        {errors.checkOutDate && <p className="text-red-500 text-xs mt-1">{errors.checkOutDate}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      className="bg-white border border-gray-300 rounded-md shadow-sm py-1 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => navigate("/bookingHome")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-md py-1 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Book Now
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Booking Summary - Improved mobile layout */}
              <div className="lg:w-1/3 mt-4 sm:mt-0">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4 sm:top-6">
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Booking Summary</h2>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={roomDetails.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} 
                          alt={roomDetails.roomType} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">{roomDetails.roomType}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Room {roomDetails.roomNumber}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                      <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                        <p className="text-gray-500">Price per night</p>
                        <p className="text-gray-900 font-medium">Rs. {roomDetails.price}</p>
                      </div>
                      
                      {stayDuration && (
                        <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                          <p className="text-gray-500">Stay duration</p>
                          <p className="text-gray-900 font-medium">{stayDuration} {stayDuration === 1 ? 'night' : 'nights'}</p>
                        </div>
                      )}
                      
                      {totalPrice && (
                        <>
                          <div className="border-t border-gray-200 my-2 sm:my-4"></div>
                          <div className="flex justify-between text-sm sm:text-base font-medium">
                            <p className="text-gray-900">Total amount</p>
                            <p className="text-blue-600">Rs. {totalPrice}</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-4 sm:mt-6 bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <h3 className="text-xs sm:text-sm font-medium text-blue-800">Booking Policy</h3>
                          <div className="mt-1 text-xs sm:text-sm text-blue-700">
                            <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
                              <li>Free cancellation up to 24 hours before check-in</li>
                              <li>Check-in time starts at 2:00 PM</li>
                              <li>Check-out time is 12:00 PM</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen px-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md w-full max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">Room not found.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/bookingHome")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base"
            >
              Return to Booking Home
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal - Improved mobile responsiveness */}
      {showConfirmation && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 sm:mx-0">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Confirm Booking
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to book {roomDetails.roomType} (Room {roomDetails.roomNumber}) 
                        {stayDuration ? ` for ${stayDuration} ${stayDuration === 1 ? 'night' : 'nights'}` : ''}. 
                        {totalPrice ? ` Total amount: Rs. ${totalPrice}.` : ''} 
                        Would you like to proceed with this booking?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmBooking}
                >
                  Confirm Booking
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPage;