import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BillPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const billRef = useRef();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/${id}`)
      .then((response) => {
        setBooking(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking:", error);
        setLoading(false);
      });
  }, [id]);

  const downloadBill = () => {
    const input = billRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`hotel-invoice-${booking._id}.pdf`);
    });
  };

  const handleSaveBill = async () => {
    try {
      const total = calculateTotal(booking);
  
      const billPayload = {
        bookingId: booking._id,
        customerName: booking.customerName,
        nic: booking.nic,
        email: booking.email,
        phone: booking.phone,
        roomNumber: booking.roomNumber,
        roomType: booking.roomType,
        gender: booking.gender,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        pricePerNight: booking.price,
        totalAmount: total,
      };
  
      await axios.post("http://localhost:5000/api/bills/create", billPayload);
      
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/BillTable");
      }, 2000);
    } catch (err) {
      console.error("Error saving bill:", err);
      alert("Failed to save bill. Please try again.");
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateTotal = (bookingData) => {
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return (bookingData.price * nights).toFixed(2);
  };

  const calculateNights = (bookingData) => {
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="auth-container flex justify-center items-center min-h-screen w-full">
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
          </div>
        ) : booking ? (
          <div className="mt-8">
            {/* Breadcrumbs */}
            <div className="flex items-center mb-8 text-sm">
              <button 
                onClick={() => navigate("/BillTable")}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Invoice Management
              </button>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-600">Invoice #{booking._id.substring(0, 8).toUpperCase()}</span>
            </div>

            {/* Invoice Header */}
            <div className="bg-white rounded-t-lg shadow-md p-8 border-t-4 border-blue-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-blue-900">Invoice</h2>
                  <p className="text-gray-600 mt-1">
                    <span className="font-semibold">Invoice Number:</span> INV-{booking._id.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-serif font-bold text-blue-900">Elegant Stay Hotel</h3>
                  <p className="text-gray-600">Grand Horizon Hotel & Resort</p>
                  <p className="text-gray-600">No. 45 Beachside Road, Galle,</p>
                  <p className="text-gray-600">Southern Province, Sri Lanka</p>
                  <p className="text-gray-600">+94 91 223 4567</p>
                  <p className="text-gray-600">info@grandhorizon.com</p>
                </div>
              </div>
            </div>

            {/* Bill Content */}
            <div ref={billRef} className="bg-white shadow-md p-8 border-l border-r">
              {/* Customer Info */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Guest Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{booking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">NIC</p>
                    <p className="font-semibold text-gray-800">{booking.nic}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{booking.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">{booking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Stay Details</h3>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-blue-500 text-sm uppercase mb-1">Room</p>
                  <p className="text-2xl font-bold text-blue-900">{booking.roomNumber}</p>
                  <p className="text-gray-600">{booking.roomType}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-green-500 text-sm uppercase mb-1">Check-in</p>
                  <p className="text-lg font-semibold text-gray-800">{formatDate(booking.checkInDate)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-red-500 text-sm uppercase mb-1">Check-out</p>
                  <p className="text-lg font-semibold text-gray-800">{formatDate(booking.checkOutDate)}</p>
                </div>
              </div>

              {/* Bill Table */}
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Charges</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-gray-500 text-sm font-medium">Description</th>
                      <th className="px-6 py-3 text-gray-500 text-sm font-medium">Nights</th>
                      <th className="px-6 py-3 text-gray-500 text-sm font-medium">Rate</th>
                      <th className="px-6 py-3 text-gray-500 text-sm font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{booking.roomType} Room</div>
                        <div className="text-sm text-gray-500">Room {booking.roomNumber}</div>
                      </td>
                      <td className="px-6 py-4">{calculateNights(booking)}</td>
                      <td className="px-6 py-4">${booking.price.toFixed(2)}/night</td>
                      <td className="px-6 py-4 text-right font-medium">${calculateTotal(booking)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right font-semibold text-gray-700">Total</td>
                      <td className="px-6 py-4 text-right font-bold text-xl text-blue-900">${calculateTotal(booking)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Thank You Note */}
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <p className="text-lg text-blue-800 font-serif">Thank you for choosing Elegant Stay Hotel!</p>
                <p className="text-gray-600 mt-1">We look forward to welcoming you again soon.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-b-lg shadow-md p-6 border-b-4 border-blue-700 flex justify-between">
              <button
                onClick={handleSaveBill}
                className="px-6 py-3 rounded-md bg-blue-700 text-white font-semibold shadow-md hover:bg-blue-800 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Save Bill
              </button>

              <button
                onClick={downloadBill}
                className="px-6 py-3 rounded-md bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Bill Not Found</h2>
            <p className="text-gray-600 mb-4">The bill you are looking for does not exist or has been removed.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-auto shadow-2xl transform transition-all animate-fadeIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Bill Saved Successfully!</h3>
              <p className="text-gray-500 mt-2">Redirecting to bill management...</p>
            </div>
          </div>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BillPage;