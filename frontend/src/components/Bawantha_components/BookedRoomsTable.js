import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BookedRoomsTable = ({ bookedRooms, refreshBookings }) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const navigate = useNavigate();


  // Handle Booking Deletion
  const handleDeleteBooking = () => {
    const { bookingId, roomNumber } = selectedBooking;

    // Delete the booking
    axios.delete(`http://localhost:5000/api/bookings/${bookingId}`)
      .then(() => {
        // Make the room available again
        axios.put(`http://localhost:5000/api/rooms/${roomNumber}/book`, { availability: true })
          .then(() => {
            toast.success("Booking canceled! Room is now available.");
            refreshBookings();
            setShowConfirmPopup(false);
          })
          .catch(error => console.error("Error updating room availability:", error));
      })
      .catch(error => console.error("Error deleting booking:", error));
  };

  // Show confirmation popup
  const confirmDelete = (bookingId, roomNumber) => {
    setSelectedBooking({ bookingId, roomNumber });
    setShowConfirmPopup(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border p-2">Booking ID</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Customer NIC</th>
            <th className="border p-2">Customer Name</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
  {bookedRooms.length > 0 ? (
    [...bookedRooms].sort((a, b) => b._id.localeCompare(a._id)).map((room) => (
      <tr
        key={room._id}
        className="text-center cursor-pointer hover:bg-gray-100 transition"
        onClick={() => navigate(`/bookings/${room._id}`)}
      >
        <td className="border p-2">{room._id}</td>
        <td className="border p-2">{room.roomNumber}</td>
        <td className="border p-2">{room.nic}</td>
        <td className="border p-2">{room.customerName}</td>

        {/* Action Buttons */}
        <td className="border p-2">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              onClick={(e) => e.stopPropagation()} // prevent row click when clicking button
              to={`/bookings/${room._id}`}
            >
              <button className="bg-green-500 text-white shadow-md rounded-md px-3 py-1 hover:bg-green-600">
                View
              </button>
            </Link>

            <Link
              onClick={(e) => e.stopPropagation()}
              to={`/bookings/${room._id}/edit`}
            >
              <button className="bg-yellow-500 text-white shadow-md rounded-md px-3 py-1 hover:bg-yellow-600">
                Update
              </button>
            </Link>

            <button
              className="bg-red-500 text-white shadow-md rounded-md px-3 py-1 hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation(); // prevent row click when clicking delete
                confirmDelete(room._id, room.roomNumber);
              }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center p-4">
        No booked rooms available
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking Cancellation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex flex-row-reverse gap-4">
              <button
                onClick={handleDeleteBooking}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes, Cancel Booking
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedRoomsTable;
