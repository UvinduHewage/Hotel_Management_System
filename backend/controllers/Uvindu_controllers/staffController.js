const Staff = require("../../models/Uvindu_models/StaffModel");
const nodemailer = require("nodemailer");

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

exports.addStaff = async (req, res) => {
  const { firstName, lastName, email, phone, jobTitle, department, shifts } = req.body;
  const profilePic = req.file ? req.file.filename : null;

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
    shifts,
    status: "Active",
    profilePic,
  });

  try {
    const savedStaff = await newStaff.save();

    // Send email to the admin after a new staff is added
    const activeShifts = Object.keys(shifts)
      .filter(shift => shifts[shift])
      .map(shift => shift.charAt(0).toUpperCase() + shift.slice(1));

    const shiftList = activeShifts.length > 0 ? activeShifts.join(', ') : 'None';

    const message = `A new staff member has been added:\n\n
    Name: ${firstName} ${lastName}\n
    Email: ${email}\n
    Phone: ${phone}\n
    Job Title: ${jobTitle}\n
    Department: ${department}\n
    Shifts: ${shiftList}\n`;

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Staff Member Added',
      text: message,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });

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