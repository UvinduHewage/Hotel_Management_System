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
      pdf.save(`booking-bill-${booking._id}.pdf`);
    });
  };

  return (
    <>
      <div
        className="flex min-h-screen bg-cover bg-center bg-no-repeat relative justify-center items-start pt-10"
        style={{
          backgroundImage: `url('https://i1.wp.com/hotel-latour.co.uk/app/app-uploads/2021/11/HLT_reception_Lifestyle1_2500-min.jpg?ssl=1&w=2500&quality=85')`,
        }}
      >
        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-10"></div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl p-6">
          {loading ? (
            <p className="p-6 text-white text-xl font-semibold text-center">Loading Bill...</p>
          ) : booking ? (
            <div className="p-10 bg-white/30 shadow-2xl rounded-lg backdrop-blur-lg border border-white border-opacity-40 w-full">
              {/* Bill Content */}
              <div ref={billRef} className="bg-white/80 p-10 rounded-lg shadow-md space-y-6">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                  Booking Bill
                </h1>

                <div className="grid grid-cols-2 gap-8 text-gray-700 text-lg">
                  <p><strong>Customer Name:</strong> {booking.customerName}</p>
                  <p><strong>NIC:</strong> {booking.nic}</p>
                  <p><strong>Email:</strong> {booking.email}</p>
                  <p><strong>Phone:</strong> {booking.phone}</p>
                  <p><strong>Room Number:</strong> {booking.roomNumber}</p>
                  <p><strong>Room Type:</strong> {booking.roomType}</p>
                  <p><strong>Price per Night:</strong> ${booking.price}</p>
                  <p><strong>Gender:</strong> {booking.gender}</p>
                  <p><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </div>

                {/* Total Calculation */}
                <div className="text-center mt-10">
                  <h2 className="text-2xl font-bold text-blue-700">Total Amount</h2>
                  <p className="text-4xl font-bold mt-4">${calculateTotal(booking)}</p>
                </div>
                <button
                    onClick={() => navigate(`/billTable`)}
                    className="px-6 py-2 rounded-md bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition"
                  >
                    {/* <Link to={`/bill/${booking._id}`}>View Bill</Link> */}
                    Save Bill
                  </button>

              </div>
              

              {/* Buttons */}
              <div className="flex justify-between items-center mt-10">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-md bg-gray-700 text-white font-bold shadow-md hover:bg-gray-800 transition"
                >
                  Back
                </button>

                <button
                  onClick={downloadBill}
                  className="px-6 py-3 rounded-md bg-green-600 text-white font-bold shadow-md hover:bg-green-700 transition"
                >
                  Save Bill as PDF
                </button>
              </div>
            </div>
          ) : (
            <p className="p-6 text-white text-xl font-semibold text-center">Bill not found.</p>
          )}
        </div>
      </div>
    </>
  );
};

function calculateTotal(booking) {
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  return (booking.price * nights).toFixed(2);
}

export default BillPage;
