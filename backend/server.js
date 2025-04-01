const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./App"); // Importing App.js

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
