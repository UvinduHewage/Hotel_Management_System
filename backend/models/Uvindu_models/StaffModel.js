const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
    required: true,
    enum: [
      "Front Desk Manager",
      "Receptionist",
      "Guest Service Agent",
      "Concierge",
      "Bellboy",
      "Bellman",
      "Night Auditor",
      "Reservation Agent",

      "Housekeeping Manager",
      "Room Attendant",
      "Housekeeping Supervisor",
      "Laundry Attendant",
      "Public Area Cleaner",

      "F&B Manager",
      "Restaurant Manager",
      "Chef",
      "Waiter",
      "Waitress",
      "Bartender",
      "Kitchen Staff",
      "Banquet Coordinator",
      "Steward",

      "Sales Manager",
      "Marketing Manager",
      "Public Relations Manager",
      "Event Coordinator",
      "Digital Marketing Specialist",

      "Finance Manager",
      "Accountant",
      "Payroll Coordinator",
      "Financial Analyst",
      "HR Manager",
      "HR Assistant",
      "Recruitment Officer",
      "Training Coordinator",

      "Security Manager",
      "Security Guard",
      "Surveillance Officer",

      "IT Manager",
      "Network Administrator",
      "Systems Support Specialist",
      "IT Technician",

      "Spa Manager",
      "Spa Therapist",
      "Fitness Instructor",
      "Pool Attendant",
      
      "Purchasing Manager",
      "Inventory Control Officer",
      "Procurement Specialist"
    ]
  },
  department: {
    type: String,
    required: true,
    enum: [
      "Front Office",
      "Housekeeping",
      "Food & Beverage",
      "Sales & Marketing",
      "Accounting",
      "Human Resources",
      "Maintenance & Engineering",
      "Security",
      "IT",
      "Spa & Recreation",
      "Purchasing & Supply"
    ]
  },
  shifts: {
    morning: {
      type: Boolean,
      default: false,
    },
    afternoon: {
      type: Boolean,
      default: false,
    },
    night: {
      type: Boolean,
      default: false,
    },
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
  profilePic: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
