const mongoose = require("mongoose");

const bookingHistorySchema = new mongoose.Schema({
  roomNumber: String,
  customerName: String,
  nic: String,
  email: String,
  phone: String,
  gender: String,
  checkInDate: Date,
  checkOutDate: Date,
  status: {
    type: String,
    default: "Booked",
  },
  price: Number,
  roomType: String,
  image: String,
  bookedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookingHistory", bookingHistorySchema);
