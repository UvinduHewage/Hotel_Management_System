import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingBillViewer = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the most recent booking
    axios
      .get('http://localhost:5000/api/bookings')
      .then((res) => {
        if (res.data.length > 0) {
          setBooking(res.data[0]); // show the latest booking
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching booking:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading bill...</div>;
  if (!booking) return <div>No booking found.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex flex-wrap gap-6 justify-center mb-10">
        {booking.rooms.map((room, index) => (
          <div
            key={index}
            className="w-72 bg-white shadow rounded p-4"
          >
            <div className="w-full h-32 bg-gray-200 mb-4 rounded"></div>
            <h3 className="font-bold text-lg">{room.name}</h3>
            <p className="text-sm mb-2">{room.nights}</p>
            <p>Room Rate: <strong>{room.roomRate.toFixed(2)}</strong></p>
            <p>Taxes & Fees: <strong>{room.taxes.toFixed(2)}</strong></p>
            <p>Resort Fee: <strong>{room.resortFee.toFixed(2)}</strong></p>
            <hr className="my-2" />
            <p className="font-semibold">Total: {room.total.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 w-96">
        <h2 className="text-xl font-bold text-center mb-4">Total Bill of Customer</h2>

        <div className="space-y-2">
          {booking.rooms.map((room, index) => (
            <div key={index} className="flex justify-between">
              <span>{room.name}:</span>
              <span>{room.total.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span>Extra charges:</span>
            <span>{booking.extraCharges.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Discount:</span>
            <span>-{booking.discount.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>{booking.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => window.print()}
          >
            Print bill
          </button>
          <button
            className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingBillViewer;
