import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentComponent = ({ bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState({
    currency: 'usd',
    amount: '',
    cardholderName: '',
    country: '',
    zip: '',
    address: '',
    city: '',
    nic: '',
    billReference: bookingId ? bookingId.substring(0, 8).toUpperCase() : ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Update form state in one place
  const updatePaymentData = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  // Fetch booking details with better error handling
  useEffect(() => {
    if (!bookingId) {
      setDataLoaded(true);
      return;
    }

    const controller = new AbortController();
    
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/bills/${bookingId}`, {
          signal: controller.signal
        });
        
        const booking = data.data;
        
        setPaymentData(prev => ({
          ...prev,
          amount: booking.totalAmount || booking.totalCost || '',
          nic: booking.nic || '',
          cardholderName: booking.customerName || '',
          billReference: bookingId.substring(0, 8).toUpperCase()
        }));
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching booking:', error);
          setError('Failed to load booking information.');
        }
      } finally {
        setDataLoaded(true);
      }
    };

    fetchBooking();

    return () => controller.abort();
  }, [bookingId]);

  // Handle Stripe Payment
  const handlePayment = async () => {
    if (!paymentData.amount || !paymentData.currency) {
      setError('Amount and currency are required.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        metadata: { nic_number: paymentData.nic },
      });

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentData.cardholderName,
            address: { 
              postal_code: paymentData.zip, 
              city: paymentData.city, 
              line1: paymentData.address, 
              country: paymentData.country 
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment success - delete booking
        try {
          await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
          navigate('/payment-success');
        } catch (err) {
          console.error("Error deleting booking after payment:", err);
          // Still navigate to success since payment was successful
          navigate('/payment-success');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Something went wrong with the payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render a skeleton UI while loading
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-36 bg-gray-200 rounded mb-4"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 px-4 sm:px-8 py-4 border-b border-gray-200">
          <div className="flex items-center text-sm">
            <button 
              onClick={() => navigate("/BillTable")}
              className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Invoice Management
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Payment #{paymentData.billReference}</span>
          </div>
        </div>
        
        <div className="p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Payment Details</h2>
          <p className="text-gray-500 text-center mb-6 sm:mb-8">Complete your payment securely</p>

          {!dataLoaded ? (
            renderSkeleton()
          ) : (
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column - Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                
                {/* Cardholder Name */}
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Cardholder Name</label>
                  <input
                    value={paymentData.cardholderName}
                    onChange={(e) => updatePaymentData('cardholderName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Billing Address */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg mb-5">
                  <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Billing Address
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-1 text-sm text-gray-600">Country</label>
                      <input 
                        placeholder="Country" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all" 
                        value={paymentData.country} 
                        onChange={(e) => updatePaymentData('country', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-gray-600">Zip/Postal Code</label>
                      <input 
                        placeholder="Zip Code" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all" 
                        value={paymentData.zip} 
                        onChange={(e) => updatePaymentData('zip', e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm text-gray-600">Street Address</label>
                    <input 
                      placeholder="Street address" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all" 
                      value={paymentData.address} 
                      onChange={(e) => updatePaymentData('address', e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm text-gray-600">City</label>
                      <input 
                        placeholder="City" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all" 
                        value={paymentData.city} 
                        onChange={(e) => updatePaymentData('city', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-gray-600">NIC Number</label>
                      <input 
                        placeholder="NIC number" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all" 
                        value={paymentData.nic} 
                        onChange={(e) => updatePaymentData('nic', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Information
                </h3>

                {/* Amount */}
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Amount (Total Bill)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      value={paymentData.amount}
                      readOnly
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700 font-medium"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Currency</label>
                  <select 
                    value={paymentData.currency} 
                    onChange={(e) => updatePaymentData('currency', e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                  >
                    <option value="usd">USD - US Dollar</option>
                    <option value="eur">EUR - Euro</option>
                    <option value="gbp">GBP - British Pound</option>
                  </select>
                </div>

                {/* Card Details */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Card Details</label>
                  <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                    <CardElement 
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your payment information is secured with 256-bit encryption
                  </p>
                </div>
                
                {/* Security Badge */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-50 px-4 py-2 rounded-full flex items-center text-xs text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Payment
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-300 font-medium flex justify-center items-center"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Pay Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate("/BillTable")}
                    className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300 font-medium flex justify-center items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent; 