import React, { useEffect, useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomCardForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const reservation = location.state?.reservation;

  const [amount, setAmount] = useState('');
  const [zip, setZip] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [nic, setNIC] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reservation?.totalCost && !amount) {
      setAmount(reservation.totalCost);
    }
  }, [reservation, amount]);

  const handlePayment = async () => {
    if (!stripe || !elements || !amount) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/payment/create-payment-intent',
        {
          amount: parseFloat(amount) * 100,
          currency: 'usd',
        }
      );

      const { clientSecret } = data;
      const card = elements.getElement(CardNumberElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name,
            address: {
              line1: address,
              postal_code: zip,
              city,
              country,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('✅ Payment successful!');
        navigate('/all-bills');
      }
    } catch (err) {
      setError('Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url("/assets/bg-payment.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500 flex items-center justify-center">
          <h2 className="text-3xl text-white font-bold">Secure Payment</h2>
        </div>

        <div className="p-6 space-y-6 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              placeholder="Enter Amount"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Card Number</label>
            <div className="p-3 border border-gray-300 rounded-md bg-white">
              <CardNumberElement />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block font-medium text-gray-700 mb-1">Expiry Date</label>
              <div className="p-3 border border-gray-300 rounded-md bg-white">
                <CardExpiryElement />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block font-medium text-gray-700 mb-1">CVC</label>
              <div className="p-3 border border-gray-300 rounded-md bg-white">
                <CardCvcElement />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Billing Address Section */}
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Billing Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Country"
                className="p-2 border rounded w-full"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <input
                placeholder="Zip Code"
                className="p-2 border rounded w-full"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
            <input
              placeholder="Street Address"
              className="w-full p-2 border rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="City"
                className="p-2 border rounded w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                placeholder="NIC Number"
                className="p-2 border rounded w-full"
                value={nic}
                onChange={(e) => setNIC(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CustomCardForm;
