const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customerName: String,
  nic: String,
  email: String,
  phone: String,
  roomNumber: String,
  roomType: String,
  gender: String,
  checkInDate: Date,
  checkOutDate: Date,
  pricePerNight: Number,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bill", billSchema);
