const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  roomType: {
    type: String,
    required: true,
    enum: ["AC", "Non AC"],
  },
  bedType: {
    type: String,
    required: true,
    enum: ["King", "Single", "Double"],
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  
  description: {
    type: String,
    required: true,
  },


  images: {
    type: [String], // Array of image URLs
    default: [],
  },
});

// //Ensure check-in date is before check-out date
// roomSchema.pre("save", function (next) {
//   if (this.checkInDate && this.checkOutDate && this.checkInDate >= this.checkOutDate) {
//     return next(new Error("Check-in date must be before check-out date"));
//   }
//   next();
// });

module.exports = mongoose.model("Room", roomSchema);
