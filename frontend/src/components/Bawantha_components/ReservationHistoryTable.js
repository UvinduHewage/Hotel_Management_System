import React from "react";

const ReservationHistoryTable = ({ reservations }) => {
  return (
    <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-3">Reservation History</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Booking ID</th>
            <th className="border p-2">Room Number</th>
            <th className="border p-2">Customer Name</th>
            <th className="border p-2">NIC</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Booked Date</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <tr key={res._id} className="text-center">
  <td className="border p-2">{res._id}</td>
  <td className="border p-2">{res.roomNumber}</td>
  <td className="border p-2">{res.customerName}</td>
  <td className="border p-2">{res.nic}</td>
  <td className="border p-2">{res.phone}</td>
  <td className="border p-2">{new Date(res.checkInDate).toLocaleDateString()}</td> 
</tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No reservation history available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationHistoryTable;
