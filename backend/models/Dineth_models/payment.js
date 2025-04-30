const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  nicNumber: { type: String }, // Optional NIC number from metadata
});

module.exports = mongoose.model("Payment", paymentSchema);
