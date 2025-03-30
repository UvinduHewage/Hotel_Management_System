const express = require("express");
const { createPaymentIntent, stripeWebhook } = require("../../controllers/Dineth_controllers/paymentController");

const router = express.Router();

// Create Payment Intent Route
router.post("/create-payment-intent", createPaymentIntent);

// Webhook Route (Important: Use express.raw() middleware in server.js for this)
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

module.exports = router;
