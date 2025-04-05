const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const bawanthaRoomRoutes = require("./routes/Bawantha_routes/roomRoutes");
const tharindaRoomRoutes = require("./routes/Tharinda_routes/roomRoutes");
const bookingRoutes = require("./routes/Bawantha_routes/bookingRoutes");
const bookingHistoryRoutes = require("./routes/Bawantha_routes/bookingHistoryRoutes"); // Uncomment if needed

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

console.log(" App.js Loaded");

// Routes
app.use("/api/rooms", roomRoutes); 


app.use("/api/bookings", bookingRoutes);
app.use("/api/booking-history", bookingHistoryRoutes); // Uncomment if needed

// Root route
app.get("/", (req, res) => {
  res.send("Hotel Management API is running");
});

module.exports = app;
