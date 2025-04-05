const express = require("express");
const cors = require("cors"); 
const path = require("path");


//Tharinda ................................................................
const roomRoutes = require("./routes/Tharinda_routes/roomRoutes"); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debugging Log
console.log(" App.js Loaded");

// Define API Routes
app.use("/api/rooms", roomRoutes); 



//Bawantha......................................................................

const bookingRoutes = require("./routes/Bawantha_routes/bookingRoutes");
const bookingHistoryRoutes = require("./routes/Bawantha_routes/bookingHistoryRoutes");

// Define API Routes

app.use("/api/bookings", bookingRoutes);

// booking history
app.use("/api/booking-history", bookingHistoryRoutes);


// Default Route for Testing
app.get("/", (req, res) => {
  res.send("Hotel Booking API is Running!");
});


module.exports = app;
