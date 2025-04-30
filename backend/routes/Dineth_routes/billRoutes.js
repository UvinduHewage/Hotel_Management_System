const express = require("express");
const {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill 
} = require("../../controllers/Dineth_controllers/billController");

const router = express.Router();

// ✅ Create a bill
router.post("/create", createBill);

// ✅ Fetch all bills
router.get("/", getAllBills);

// ✅ Fetch single bill by ID
router.get("/:id", getBillById);

// ✅ Update bill by ID
router.put("/:id", updateBill);

// ✅ delete bill by ID
router.delete("/:id", deleteBill);


module.exports = router;

