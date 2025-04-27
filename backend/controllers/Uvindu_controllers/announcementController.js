const Announcement = require('../../models/Uvindu_models/AnnouncementModel');

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      description,
      date: new Date()
    });

    await newAnnouncement.save();
    res.status(201).json({ success: true, message: 'Announcement added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add announcement.' });
  }
};

// Get today's announcements
exports.getTodaysAnnouncements = async (req, res) => {
    try {
        // Get the current date and set the time to midnight for the start of today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); 
        
        // Log the start and end dates for debugging
        console.log('Start of day:', startOfDay);
        console.log('End of day:', endOfDay);
    
        // Find announcements where the date is between startOfDay and endOfDay
        const announcements = await Announcement.find({
          date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ date: -1 }); 
    
        // Send the response
        res.status(200).json({ success: true, data: announcements });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch announcements.' });
      }
};
