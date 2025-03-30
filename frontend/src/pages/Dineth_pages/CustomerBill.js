import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;

  if (!reservation) {
    return <p className="text-center py-10 text-red-600">No reservation data found.</p>;
  }

  const {
    firstName,
    lastName,
    roomName,
    roomRate,
    taxes,
    resortFee,
    totalCost,
    email,
    phone,
    checkInDate,
    checkOutDate,
  } = reservation;

  // ✅ Handle Save to DB + Navigate
  const handleSaveAndNavigate = async () => {
    try {
      await axios.post('http://localhost:5000/api/bills', {
        firstName,
        lastName,
        email,
        phone,
        checkInDate,
        checkOutDate,
        roomName,
        roomRate,
        taxes,
        resortFee,
        totalCost,
      });

      navigate('/payment', { state: { reservation } }); // Go to payment
    } catch (err) {
      console.error('❌ Failed to save bill:', err.message);
      alert('Failed to save the bill. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Customer Bill</h2>

      <div className="mb-4 space-y-1">
        <p><strong>Name:</strong> {firstName} {lastName}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Check-In:</strong> {new Date(checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-Out:</strong> {new Date(checkOutDate).toLocaleDateString()}</p>
      </div>

      <div className="border-t pt-4 space-y-2 text-sm">
        <p><strong>Room:</strong> {roomName}</p>
        <p><strong>Room Rate:</strong> ${roomRate}</p>
        <p><strong>Taxes:</strong> ${taxes}</p>
        <p><strong>Resort Fee:</strong> ${resortFee}</p>
        <hr className="my-2" />
        <p className="text-lg font-semibold text-right">Total: ${totalCost}</p>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Print Bill
        </button>

        <button
          onClick={handleSaveAndNavigate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default CustomerBill;
