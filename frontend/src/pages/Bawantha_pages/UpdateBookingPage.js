import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaUser, 
  FaIdCard, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarCheck, 
  FaVenusMars,
  FaArrowLeft,
  FaEdit
} from "react-icons/fa";

const UpdateBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    nic: "",
    email: "",
    phone: "",
    gender: "Male",
    checkInDate: "",
    checkOutDate: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/${id}`)
      .then((response) => {
        setBooking(response.data.data);
        setFormData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking:", error);
        setLoading(false);
        toast.error("Could not retrieve booking information");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};

    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[0-9]+$/;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (!formData.customerName.trim()) {
      errors.customerName = "Customer Name is required";
    } else {
      const nameParts = formData.customerName.trim().split(" ");
      for (let part of nameParts) {
        if (!nameRegex.test(part)) {
          errors.customerName = "Customer Name can only contain letters";
          break;
        }
      }
    }

    if (!formData.nic.trim()) {
      errors.nic = "NIC is required";
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = "Phone number must contain only numbers";
    }

    if (!formData.checkInDate) {
      errors.checkInDate = "Check-in Date is required";
    } else if (new Date(formData.checkInDate) < today) {
      errors.checkInDate = "Check-in Date cannot be in the past";
    }

    if (!formData.checkOutDate) {
      errors.checkOutDate = "Check-out Date is required";
    } else if (new Date(formData.checkOutDate) < today) {
      errors.checkOutDate = "Check-out Date cannot be in the past";
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      if (checkIn >= checkOut) {
        errors.checkOutDate = "Check-out Date must be after Check-in Date";
      }
    }

    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      toast.error(errors[firstErrorKey]);
    }

    return Object.keys(errors).length === 0;
  };

  const handleUpdateBooking = async () => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, formData);
      toast.success("Booking updated successfully!");
      setShowConfirmPopup(false);
      navigate(-1);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking!");
      setShowConfirmPopup(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmPopup(true);
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-8 text-sm">
          <button
            onClick={() => navigate("/booked-rooms")}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Booking Management
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">
            View Booking #{booking?._id?.substring(0, 8).toUpperCase() || "BREF12345"}
          </span>
        </div>

{/* Header */}
<div className="bg-blue-700 text-white shadow-lg rounded-2xl overflow-hidden">
  <div className="container mx-auto py-6 px-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold">Update Booking</h1>
      </div>
      <div className="text-sm opacity-80 bg-blue-800 py-2 px-4 rounded-full">
        Booking ID: #{id}
      </div>
    </div>
  </div>
</div>

      <div className="container mx-auto py-8 px-4">

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-400 mb-3"></div>
              <div className="h-4 w-36 bg-blue-400 rounded"></div>
            </div>
          </div>
        ) : booking ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room Info Card */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="h-48 relative">
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage: `url(${booking.image || "https://source.unsplash.com/800x600/?hotel-room"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="text-sm font-semibold bg-blue-700 rounded-full px-3 py-1 inline-block mb-2">
                      {booking.roomType}
                    </div>
                    <h2 className="text-xl font-bold">Room {booking.roomNumber}</h2>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Price per night</span>
                    <span className="text-blue-700 font-bold text-lg">Rs. {booking.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total nights</span>
                    <span className="font-semibold">{calculateNights()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Total amount</span>
                    <span className="text-blue-700 font-bold text-xl">
                      Rs. {booking.price * calculateNights()}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-2">Booking Status</h3>
                    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-medium inline-block">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <FaEdit className="text-blue-700" />
                    <h2 className="text-lg font-semibold text-gray-800">Edit Guest Information</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FaUser className="text-blue-600" />
                        <span>Customer Name</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FaIdCard className="text-blue-600" />
                        <span>NIC</span>
                      </label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter NIC number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FaEnvelope className="text-blue-600" />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FaPhone className="text-blue-600" />
                        <span>Phone</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FaVenusMars className="text-blue-600" />
                        <span>Gender</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FaCalendarCheck className="text-blue-600" />
                        <span>Check-In Date</span>
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <FaCalendarCheck className="text-blue-600" />
                        <span>Check-Out Date</span>
                      </label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={formData.checkOutDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-red-500 text-5xl mb-4">!</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Not Found</h2>
              <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Update</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to update the booking information for {formData.customerName}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateBookingPage;