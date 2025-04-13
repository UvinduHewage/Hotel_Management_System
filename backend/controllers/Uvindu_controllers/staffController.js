const Staff = require("../../models/Uvindu_models/StaffModel");
const sendEmail = require("../../config/email");

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching staff", error: err.message });
  }
};

// Add staff member and send email notification
exports.addStaff = async (req, res) => {
  const { firstName, lastName, email, phone, jobTitle, department, shifts } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  console.log("Raw shifts from request:", shifts);
  console.log("Type of shifts:", typeof shifts);
  console.log("Is array:", Array.isArray(shifts));

  let parsedShifts = shifts;
  if (typeof shifts === 'string') {
    try {
      parsedShifts = JSON.parse(shifts);
      console.log("Parsed shifts from string:", parsedShifts);
    } catch (e) {
      console.log("Failed to parse shifts string:", e.message);
    }
  }

  if (!firstName || !lastName || !email || !phone || !jobTitle || !department || !shifts) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newStaff = new Staff({
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    department,
    shifts: parsedShifts,
    status: "Active",
    profilePic,
  });

  try {
    const savedStaff = await newStaff.save();
    
    console.log("Shifts saved in database:", savedStaff.shifts);
    
    let shiftList = 'None';
    const dbShifts = savedStaff.shifts;
    
    if (typeof dbShifts === 'object' && dbShifts !== null) {
      console.log("Keys in shifts object:", Object.keys(dbShifts));
      console.log("Full shifts object content:", JSON.stringify(dbShifts));
      
      const shiftsObj = dbShifts.toObject ? dbShifts.toObject() : dbShifts;
      
      if (Array.isArray(shiftsObj)) {
        shiftList = shiftsObj.join(', ');
        console.log("Treating shifts as array:", shiftList);
      } else {
        for (const [key, value] of Object.entries(shiftsObj)) {
          console.log(`Shift '${key}' has value:`, value, "type:", typeof value);
        }
        
        const trueShifts = Object.keys(shiftsObj).filter(key => shiftsObj[key] === true);
        console.log("Shifts with value===true:", trueShifts);
        
        const truthyShifts = Object.keys(shiftsObj).filter(key => shiftsObj[key]);
        console.log("Shifts with truthy values:", truthyShifts);
        
        if (truthyShifts.length > 0) {
          shiftList = truthyShifts.join(', ');
        }
      }
    }
    
    console.log("Final shift list for email:", shiftList);

    const message = `A new staff member has been added:\n\n
    Name: ${firstName} ${lastName}\n
    Email: ${email}\n
    Phone: ${phone}\n
    Job Title: ${jobTitle}\n
    Department: ${department}\n
    Shifts: ${shiftList}\n`;

    try {
      await sendEmail('New Staff Member Added', message);
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    res.status(201).json({
      message: "Staff added successfully",
      staff: savedStaff,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding staff", error: err.message });
  }
};

// Update staff profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const profilePic = req.file ? req.file.filename : null;
    if (!profilePic) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(id, { profilePic }, { new: true });

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({ message: "Profile picture updated successfully", staff: updatedStaff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile picture", error: err.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    for (let id in attendanceData) {
      await Staff.findByIdAndUpdate(id, { status: attendanceData[id] ? "Active" : "Inactive" });
    }
    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating attendance", error: err.message });
  }
};

// Get active staff count
exports.getActiveStaffCount = async (req, res) => {
  try {
    const count = await Staff.countDocuments({ status: "Active" });
    res.status(200).json({ activeStaff: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching active staff count", error: err.message });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findByIdAndDelete(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staffId = req.params.id;
    const staffMember = await Staff.findById(staffId);

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json(staffMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching staff by ID", error: err.message });
  }
};

// Update staff by ID
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, jobTitle, department, status } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  try {
    // Find the staff member by ID
    const staffMember = await Staff.findById(id);

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Update the staff member's details
    staffMember.firstName = firstName || staffMember.firstName;
    staffMember.lastName = lastName || staffMember.lastName;
    staffMember.email = email || staffMember.email; 
    staffMember.phone = phone || staffMember.phone; 
    staffMember.jobTitle = jobTitle || staffMember.jobTitle;
    staffMember.department = department || staffMember.department;
    staffMember.status = status || staffMember.status;

    // Check if a new profile picture is provided and update it
    if (profilePic) { 
      staffMember.profilePic = profilePic;
    }

    // Save the updated staff member
    await staffMember.save();

    return res.status(200).json({ message: "Staff updated successfully", staffMember });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while updating staff" });
  }
};