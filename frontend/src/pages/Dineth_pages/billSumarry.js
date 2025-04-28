import React from 'react';

const PaymentSummary = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Payments Summary of Booking</h2>

      {/* Rooms section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Normal Double Room */}
        <div className="p-4 border rounded-lg shadow">
          <div className="h-40 bg-gray-200 mb-4" /> {/* Room image placeholder */}
          <h3 className="text-xl font-semibold mb-2">Normal Double Room</h3>
          <p className="text-gray-600 mb-1">2 nights (Aug 15 - Aug 17)</p>
          <p>Room Rate - $300.00</p>
          <p>Taxes & Fees - $45.00</p>
          <p>Resort Fee - $25.00</p>
          <p className="font-semibold mt-2">Total - $370.00</p>
        </div>

        {/* Deluxe Ocean View Room */}
        <div className="p-4 border rounded-lg shadow">
          <div className="h-40 bg-gray-200 mb-4" /> {/* Room image placeholder */}
          <h3 className="text-xl font-semibold mb-2">Deluxe Ocean View Room</h3>
          <p className="text-gray-600 mb-1">2 nights (Aug 15 - Aug 17)</p>
          <p>Room Rate - $350.00</p>
          <p>Taxes & Fees - $50.00</p>
          <p>Resort Fee - $25.00</p>
          <p className="font-semibold mt-2">Total - $425.00</p>
        </div>
      </div>

      {/* Total Bill section */}
      <div className="p-6 border rounded-lg shadow bg-gray-50">
        <h3 className="text-2xl font-bold mb-6 text-center">Total bill of customer</h3>

        {/* Bill Items */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span>Normal Double Room</span>
            <span>$370.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Deluxe Ocean View Room</span>
            <span>$425.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Extra chargers</span>
            <span>$150.00</span>
          </div>
          <div className="flex justify-between items-center text-red-500">
            <span>Discount</span>
            <span>-$100.00</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
          <span>Total</span>
          <span>$845.00</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800">Print bill</button>
          <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">Confirm Payment</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
