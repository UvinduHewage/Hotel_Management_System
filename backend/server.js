
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const paymentRoutes = require("./routes/Dineth_routes/paymentRoutes");
const staffRoutes = require("./routes/Uvindu_routes/staffRoutes");
const announcementRoutes = require("./routes/Uvindu_routes/announcementsRoutes");
const adminRoutes = require('./routes/Uvindu_routes/adminRoutes');
const authRoutes = require('./routes/Uvindu_routes/authRoutes');

const app = require("./App");  


dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Routes
app.use("/api", staffRoutes); 
app.use("/api", announcementRoutes);
app.use("/api/payment", paymentRoutes);

//Login routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});