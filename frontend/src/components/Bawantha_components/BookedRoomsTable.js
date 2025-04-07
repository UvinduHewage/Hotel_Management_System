import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const BookedRoomsTable = ({ bookedRooms, refreshBookings }) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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
            refreshBookings(); // Refresh the booked rooms list
            setShowConfirmPopup(false); // Close the popup
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
      <h3 className="text-xl font-semibold mb-5">Reserved Rooms</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Booking ID</th>
            <th className="border p-2">Room Number</th>
            <th className="border p-2">Customer NIC</th>
            <th className="border p-2">Customer Name</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookedRooms.length > 0 ? (
             [...bookedRooms].sort((a, b) => b._id.localeCompare(a._id)).map((room) => (
              <tr key={room._id} className="text-center">
                <td className="border p-2">{room._id}</td> 
                <td className="border p-2">{room.roomNumber}</td>
                <td className="border p-2">{room.nic}</td>
                <td className="border p-2">{room.customerName}</td>
                <td className="border p-2">
                  <div className="flex flex-col space-y-2 items-center justify-center">
                    <Link to={`/bookings/${room._id}`} className="w-full">
                      <button className="bg-green-500 shadow-md rounded-md text-white px-3 py-1 hover:bg-green-600 w-full">
                        View
                      </button>
                    </Link>
                    <Link to={`/bookings/${room._id}/edit`} className="w-full">
                      <button className="bg-yellow-500 text-white shadow-md rounded-md px-3 py-1 hover:bg-yellow-600 w-full">
                        Update
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 shadow-md rounded-md text-white px-3 py-1 hover:bg-red-600 w-full"
                      onClick={() => confirmDelete(room._id, room.roomNumber)}
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
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all">
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