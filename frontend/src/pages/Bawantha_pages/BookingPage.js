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

  return (
    <>
      <ToastContainer />
      <div
        className="flex min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('https://i1.wp.com/hotel-latour.co.uk/app/app-uploads/2021/11/HLT_reception_Lifestyle1_2500-min.jpg?ssl=1&w=2500&quality=85')`,
        }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-10"></div>
        <div className="flex-1 p-6 relative z-10">
          {loading ? (
            <p>Loading room details...</p>
          ) : roomDetails ? (
            <div className="p-14 min-h-screen bg-transparent">
              <div
                className="relative w-3/4 h-60 shadow-sm rounded-lg overflow-hidden mb-6 mx-auto flex items-center justify-between p-10 bg-white"
                style={{
                  backgroundImage: `url(${roomDetails.images?.[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center text-center text-white">
                  <h2 className="text-3xl font-bold">
                    {roomDetails.roomType} - Room {roomDetails.roomNumber}
                  </h2>
                  <p className="text-lg">Rs. {roomDetails.price} per night</p>
                </div>
              </div>

              <div className="bg-white/40 p-6 shadow-lg rounded-lg w-3/4 backdrop-blur-md mx-auto flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-14 text-center">Add Customer Details</h2>
                <form onSubmit={handleBookNow} className="grid grid-cols-2 gap-x-24 gap-y-9">
                  {[
                    { name: "firstName", label: "First Name" },
                    { name: "lastName", label: "Last Name" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "nic", label: "NIC" },
                    { name: "phone", label: "Phone" },
                  ].map(({ name, label, type }) => (
                    <div key={name}>
                      <label className="block text-gray-800 font-medium mb-1">{label}</label>
                      <input
                        type={type || "text"}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                        placeholder={`Enter ${label}`}
                      />
                      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
                    </div>
                  ))}

                  {/* Gender */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Check-in/out dates */}
                  {["checkInDate", "checkOutDate"].map((field) => (
                    <div key={field}>
                      <label className="block text-gray-800 font-medium mb-1">
                        {field === "checkInDate" ? "Check-In" : "Check-Out"}
                      </label>
                      <input
                        type="date"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                      />
                      {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                    </div>
                  ))}

                  <div className="col-span-2 flex justify-between mt-4">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      onClick={() => navigate("/bookingHome")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Book Now
                    </button>
                  </div>
                </form>
              </div>

              {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking</h3>
                    <p className="text-gray-600 mb-6">Are you sure you want to book this Room?</p>
                    <div className="flex flex-row-reverse gap-4">
                      <button
                        onClick={handleConfirmBooking}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Yes, Book Now
                      </button>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-500">Room not found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingPage;
