// models/Booking.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  nights: String,
  roomRate: Number,
  taxes: Number,
  resortFee: Number,
  total: Number, // You can store this or calculate it dynamically
});

const bookingSchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,

  rooms: [roomSchema],
  extraCharges: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },

  subtotal: Number,
  grandTotal: Number,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
