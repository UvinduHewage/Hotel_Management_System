const express = require("express");
const router = express.Router();

const bookingHistoryController = require("../../controllers/Bawantha_controllers/bookingHistoryController");

// GET all booking history records
router.get("/", bookingHistoryController.getAllBookingHistory);

// GET a single booking history record by ID
router.get("/:id", bookingHistoryController.getBookingHistoryById);

// POST a new history record (optional – could be used for manual insertion or from frontend)
router.post("/", bookingHistoryController.createBookingHistory);

//Delete all history records 
router.delete("/", bookingHistoryController.deleteAllBookingHistory);

module.exports = router;
