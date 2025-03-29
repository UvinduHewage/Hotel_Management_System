const Booking = require("../../models/Bawantha_models/Booking");

//GET All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//GET Booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({}, "_id roomNumber customerName nic phone checkInDate"); 
//   } catch (error) {
//     console.error("Error fetching reservations:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// POST Create a Booking
exports.createBooking = async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    console.error(" Error creating booking:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// PUT Update Booking Status
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error(" Error updating booking:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE a Booking
exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
