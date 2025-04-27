const express = require("express");
const router = express.Router();
const announcementController = require("../../controllers/Uvindu_controllers/announcementController");

router.post("/announcements", announcementController.createAnnouncement);

router.get("/announcements/today", announcementController.getTodaysAnnouncements);

module.exports = router;
