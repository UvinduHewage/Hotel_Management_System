const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Import routes
const roomRoutes = require("./routes/Tharinda_routes/roomRoutes"); 
const bookingRoutes = require("./routes/Bawantha_routes/bookingRoutes");
const bookingHistoryRoutes = require("./routes/Bawantha_routes/bookingHistoryRoutes");
const paymentRoutes = require("./routes/Dineth_routes/paymentRoutes");

// Import controllers
const paymentController = require("./controllers/Dineth_controllers/paymentController"); // ✅ Import your payment controller

const app = express();

// Stripe Webhook Route - use express.raw() middleware FIRST (before express.json())
app.post("/api/payment/stripe-webhook", express.raw({ type: "application/json" }), paymentController.stripeWebhook);

console.log(" App.js Loaded");

// Middlewares (AFTER webhook route)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Normal API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/booking-history", bookingHistoryRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Hotel Management API is running");
});

module.exports = app;
