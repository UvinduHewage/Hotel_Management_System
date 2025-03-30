import React from 'react';
import { useLocation } from 'react-router-dom';

const BillingPage = () => {
  const location = useLocation();
  const reservation = location.state?.reservation;

  if (!reservation) return <p className="text-center mt-10">No reservation data provided.</p>;

  const {
    firstName, lastName, email, phone,
    roomName, roomRate, taxes, resortFee, totalCost,
    checkInDate, checkOutDate
  } = reservation;

  return (
    <div className="max-w-2xl mx-auto bg-white mt-10 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Payment Summary</h2>

      <div className="mb-4 space-y-1">
        <p><strong>Name:</strong> {firstName} {lastName}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Check-In:</strong> {new Date(checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-Out:</strong> {new Date(checkOutDate).toLocaleDateString()}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold text-lg mb-2">Room: {roomName}</h3>
        <p><strong>Room Rate:</strong> ${roomRate}</p>
        <p><strong>Taxes:</strong> ${taxes}</p>
        <p><strong>Resort Fee:</strong> ${resortFee}</p>
        <p className="text-right font-bold text-xl border-t pt-2 mt-2">
          Total: ${totalCost}
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
          Print Bill
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
