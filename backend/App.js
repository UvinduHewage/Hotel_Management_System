const express = require("express");
const cors = require("cors"); 
const roomRoutes = require("./routes/Bawantha_routes/roomRoutes"); 
const bookingRoutes = require("./routes/Bawantha_routes/bookingRoutes");
const bookingHistoryRoutes = require("./routes/Bawantha_routes/bookingHistoryRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

// Define API Routes
app.use("/api/rooms", roomRoutes); 
app.use("/api/bookings", bookingRoutes);

// booking history
app.use("/api/booking-history", bookingHistoryRoutes);

// Default Route for Testing
app.get("/", (req, res) => {
  res.send("Hotel Management API is running");
});

module.exports = app;