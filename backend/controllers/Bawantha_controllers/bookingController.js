const Booking = require("../../models/Bawantha_models/Booking");
const BookingHistory = require("../../models/Bawantha_models/BookingHistory");

// GET All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST Create a Booking
exports.createBooking = async (req, res) => {
  try {
    // 1. Create booking
    const newBooking = await Booking.create(req.body);

    if (newBooking) {
      // 2. If booking created, save in history
      const historyData = {
        roomNumber: newBooking.roomNumber,
        customerName: newBooking.customerName,
        nic: newBooking.nic,
        email: newBooking.email,
        phone: newBooking.phone,
        gender: newBooking.gender,
        checkInDate: newBooking.checkInDate,
        checkOutDate: newBooking.checkOutDate,
        roomType: newBooking.roomType,
        price: newBooking.price,
        image: newBooking.image,
        status: "Booked", // Start as Booked
        bookedDate: new Date()
      };

      await BookingHistory.create(historyData);
    }

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET Booking by ID
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

// PUT Update Booking
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
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

    // Update corresponding history record status to 'Cancelled'
    await BookingHistory.findOneAndUpdate(
      { roomNumber: deletedBooking.roomNumber, nic: deletedBooking.nic },
      { status: "Cancelled" }
    );

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
