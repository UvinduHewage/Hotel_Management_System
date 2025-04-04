const express = require("express");
const multer = require("multer");
const path = require("path");
const staffController = require("../../controllers/Uvindu_controllers/staffController");

const router = express.Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Set upload destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid filename conflicts
  },
});

const upload = multer({ storage });

// Routes for staff management

router.get("/staff", staffController.getAllStaff);
router.get("/staff/active-count", staffController.getActiveStaffCount);
router.delete("/staff/:id", staffController.deleteStaff);
router.get("/staff/:id", staffController.getStaffById);
router.put("/staff/:id", upload.single("profilePic"), staffController.updateStaff);


// POST new staff (Now includes file upload for profile picture)
router.post("/staff", upload.single("profilePic"), staffController.addStaff);

// PUT update profile picture
router.put("/staff/:id/profilePic", upload.single("profilePic"), staffController.updateProfilePicture);

// POST update attendance (bulk update for attendance status)
router.post("/staff/attendance", staffController.updateAttendance);




module.exports = router;
