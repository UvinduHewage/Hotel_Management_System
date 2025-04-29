import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentComponent = ({ bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [currency, setCurrency] = useState('usd');
  const [amount, setAmount] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [nic, setNic] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch booking details by ID
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
        console.log("📦 Booking fetched:", data);
  
        const booking = data.data; // ✅ Extract the booking object from `data`
  
        setAmount(booking.price || booking.totalCost || '');
        setNic(booking.nic || '');
        setCardholderName(booking.customerName || '');
      } catch (error) {
        console.error('❌ Error fetching booking:', error);
        setError('Failed to load booking information.');
      } finally {
        setLoading(false);
      }
    };
  
    if (bookingId) fetchBooking();
  }, [bookingId]);
  

  // ✅ Handle Stripe Payment
  const handlePayment = async () => {
    if (!amount || !currency) {
      setError('Amount and currency are required.');
      return;
    }

    setPaying(true);
    setError(null);

    try {
      const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount,
        currency,
        metadata: { nic_number: nic },
      });

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
            address: { postal_code: zip, city, line1: address, country },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else {
        alert('✅ Payment Successful!');
        navigate('/'); // or redirect to /payment-success
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading booking info...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-3xl font-semibold text-center mb-8">Payment Details</h2>

      {/* Cardholder Name */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Cardholder Name</label>
        <input
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Billing Address */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input placeholder="Country" className="p-2 border rounded" value={country} onChange={(e) => setCountry(e.target.value)} />
          <input placeholder="Zip Code" className="p-2 border rounded" value={zip} onChange={(e) => setZip(e.target.value)} />
        </div>
        <input placeholder="Street address" className="w-full mb-4 p-2 border rounded" value={address} onChange={(e) => setAddress(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="City" className="p-2 border rounded" value={city} onChange={(e) => setCity(e.target.value)} />
          <input placeholder="NIC number" className="p-2 border rounded" value={nic} onChange={(e) => setNic(e.target.value)} />
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Amount (Total Bill)</label>
        <input
          type="number"
          value={amount}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Currency */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-2 border rounded">
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
      </div>

      {/* Card Details */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Card Details</label>
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
          <CardElement />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full p-3 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-500 transition duration-300"
        >
          {paying ? 'Processing...' : 'Pay Now'}
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-full p-3 border border-gray-500 rounded transition duration-300"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default PaymentComponent;
