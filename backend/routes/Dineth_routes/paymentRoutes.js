const express = require('express');
const { createPaymentIntent } = require('../../controllers/Dineth_controllers/paymentController');

const router = express.Router();

// Route to create a PaymentIntent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
