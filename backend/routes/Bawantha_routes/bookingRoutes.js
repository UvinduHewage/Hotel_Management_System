const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/Bawantha_controllers/bookingController");

console.log("bookingRoutes.js Loaded");

//Define Routes
router.get("/", bookingController.getAllBookings); // GET all bookings
router.get("/:id", bookingController.getBookingById); // GET booking by ID
router.post("/", bookingController.createBooking); // POST create booking
router.put("/:id", bookingController.updateBooking); // PUT update booking
router.delete("/:id", bookingController.deleteBooking); // DELETE a booking

module.exports = router;
