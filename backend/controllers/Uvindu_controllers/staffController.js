const Staff = require("../../models/Uvindu_models/StaffModel");
const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const xl = require("excel4node");

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

// Export staff data to Excel - No Styles
exports.exportToExcel = async (req, res) => {
  try {
    const staff = await Staff.find();
    const totalStaff = staff.length;
    const activeStaff = staff.filter(member => member.status === "Active").length;
    const attendanceRate = totalStaff > 0 ? ((activeStaff / totalStaff) * 100).toFixed(2) : 0;
    const openPositions = totalStaff - activeStaff;
    
    const workbook = new ExcelJS.Workbook();
    
    // Create Statistics Sheet
    const statsSheet = workbook.addWorksheet('Staff Statistics');
    
    // Add title
    statsSheet.mergeCells('A1:B1');
    statsSheet.getCell('A1').value = 'Staff Management System Report';
    
    // Add report generation date
    statsSheet.mergeCells('A2:B2');
    statsSheet.getCell('A2').value = `Generated on: ${new Date().toLocaleString()}`;
    
    // Add statistics
    statsSheet.addRow([]);
    statsSheet.addRow(['Statistic', 'Value']);
    statsSheet.addRow(['Total Staff', totalStaff]);
    statsSheet.addRow(['Active Staff', activeStaff]);
    statsSheet.addRow(['Attendance Rate', `${attendanceRate}%`]);
    statsSheet.addRow(['Open Positions', openPositions]);
    
    // Create Staff Details Sheet
    const detailsSheet = workbook.addWorksheet('Staff Details');
    
    // Add headers
    detailsSheet.addRow(['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Job Title', 'Department', 'Status']);
    
    // Add staff data
    staff.forEach(member => {
      detailsSheet.addRow([
        member._id.toString(),
        member.firstName,
        member.lastName,
        member.email || 'N/A',
        member.phone || 'N/A',
        member.jobTitle,
        member.department,
        member.status
      ]);
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Staff_Report.xlsx');
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting staff data to Excel:', err);
    res.status(500).json({ message: 'Failed to export staff data to Excel', error: err.message });
  }
};

// Export staff data to PDF
exports.exportToPDF = async (req, res) => {
  try {
    const staff = await Staff.find();
    const totalStaff = staff.length;
    const activeStaff = staff.filter(member => member.status === "Active").length;
    const attendanceRate = totalStaff > 0 ? ((activeStaff / totalStaff) * 100).toFixed(2) : 0;
    const openPositions = totalStaff - activeStaff;
    
    // Create a PDF document
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Staff_Report.pdf');
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add header
    doc.fontSize(20).text('Staff Management System Report', { align: 'center' });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);
    
    // Add statistics section
    doc.fontSize(16).text('Staff Statistics', { underline: true });
    doc.moveDown(1);
    
    const statsTable = {
      headers: ['Statistic', 'Value'],
      rows: [
        ['Total Staff', totalStaff.toString()],
        ['Active Staff', activeStaff.toString()],
        ['Attendance Rate', `${attendanceRate}%`],
        ['Open Positions', openPositions.toString()]
      ]
    };
    
    // Define table layout
    const tableLayout = {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
      prepareRow: () => doc.font('Helvetica').fontSize(10)
    };
    
    // Draw statistics table
    doc.table(statsTable, tableLayout);
    doc.moveDown(2);
    
    // Add staff details section
    doc.fontSize(16).text('Staff Details', { underline: true });
    doc.moveDown(1);
    
    // Create staff details table
    let staffDetailsTable = {
      headers: ['Name', 'Job Title', 'Department', 'Status'],
      rows: staff.map(member => [
        `${member.firstName} ${member.lastName}`,
        member.jobTitle,
        member.department,
        member.status
      ])
    };
    
    // Draw staff details table
    doc.table(staffDetailsTable, tableLayout);
    
    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('Error exporting staff data to PDF:', err);
    res.status(500).json({ message: 'Failed to export staff data to PDF', error: err.message });
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
  const { firstName, lastName, jobTitle, department, status } = req.body;
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