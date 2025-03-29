const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  customerName: { type: String, required: true },
  nic: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  status: { type: String, enum: ["Booked", "Checked-in", "Completed"], default: "Booked" }
});

module.exports = mongoose.model("Booking", bookingSchema);