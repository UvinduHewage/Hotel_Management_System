const BookingHistory = require("../../models/Bawantha_models/BookingHistory");

// Create a new history entry manually 
exports.createBookingHistory = async (req, res) => {
  try {
    const history = await BookingHistory.create(req.body);
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    console.error(" Error creating booking history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Get all booking history entries
exports.getAllBookingHistory = async (req, res) => {
  try {
    const history = await BookingHistory.find().sort({ bookedDate: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error(" Error fetching booking history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//  Get single history entry by ID
exports.getBookingHistoryById = async (req, res) => {
  try {
    const history = await BookingHistory.findById(req.params.id);
    if (!history) {
      return res.status(404).json({ success: false, message: "History record not found" });
    }
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error(" Error fetching history by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// clear history
exports.deleteAllBookingHistory = async (req, res) => {
  try {
    await BookingHistory.deleteMany();
    res.status(200).json({ success: true, message: "All booking history cleared" });
  } catch (error) {
    console.error(" Error clearing booking history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
