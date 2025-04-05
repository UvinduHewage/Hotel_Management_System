const express = require("express");
const router = express.Router();
const roomController = require("../../controllers/Tharinda_controllers/roomController");
const { updateRoom } = require("../../controllers/Tharinda_controllers/roomController");


console.log("roomRoutes.js Loaded");

// POST - Create a new room
router.post("/", roomController.createRoom);

// GET - Fetch all rooms
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);

//for booking page rooms details
router.get("/summary", roomController.getRoomSummary);
router.get("/available", roomController.getAvailableRooms);
// UPDATE
router.put("/:id", roomController.updateRoom);

// DELETE
router.delete("/:id", roomController.deleteRoom);


router.get("/number/:roomNumber", roomController.getRoomByRoomNumber);

// // GET - Fetch a single room by ID
// router.get("/:id", roomController.getRoomById)


router.put("/:roomNumber/book", roomController.markRoomAsBooked);
router.put("/:roomNumber/available", roomController.markRoomAsAvailable);








module.exports = router;
