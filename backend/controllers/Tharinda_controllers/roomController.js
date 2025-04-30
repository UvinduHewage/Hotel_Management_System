const Room = require("../../models/Tharinda_models/Room");

//Create a New Room
exports.createRoom = async (req, res) => {
  try {
    console.log(" createRoom function triggered");
    console.log(" Received Data:", req.body);

    let room;
    if (Array.isArray(req.body)) {
      room = await Room.insertMany(req.body);
    } else {
      room = await Room.create(req.body);
    }

    console.log(" Room Created Successfully:", room);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    console.error(" Error creating room:", error); 
    res.status(500).json({ success: false, error: error.message });
  }
};


//Fetch All Rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find(); 
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    console.error(" Error fetching rooms:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//Fetch a Single Room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.error(" Error fetching room by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch a Single Room by Room Number
exports.getRoomByRoomNumber = async (req, res) => {
  try {
    const room = await Room.findOne({ roomNumber: req.params.roomNumber });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.error("Error fetching room by room number:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



// Fetch Specific Room Fields 
exports.getRoomSummary = async (req, res) => {
  try {
    const rooms = await Room.find({}, "roomNumber roomType price images");

    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    console.error(" Error fetching room summary:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.markRoomAsBooked = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomNumber: req.params.roomNumber },
      { availability: false }, 
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.error(" Error marking room as booked:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.markRoomAsAvailable = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomNumber: req.params.roomNumber },
      { availability: true }, 
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.error(" Error marking room as available:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch Only Available Rooms
exports.getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ availability: true });
    res.status(200).json({ success: true, data: availableRooms });
  } catch (error) {
    console.error(" Error fetching available rooms:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// Delete Room by ID
exports.deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Room by ID
exports.updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, data: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
