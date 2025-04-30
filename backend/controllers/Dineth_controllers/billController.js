const Bill = require("../../models/Dineth_models/bill");


exports.createBill = async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    console.error("Error saving bill:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// ✅ Fetch All Bills
exports.getAllBills = async (req, res) => {
    try {
      const bills = await Bill.find().sort({ createdAt: -1 }); // latest first
      res.status(200).json({ success: true, data: bills });
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // ✅ Fetch Single Bill by ID
  exports.getBillById = async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id);
      if (!bill) {
        return res.status(404).json({ success: false, message: "Bill not found" });
      }
      res.status(200).json({ success: true, data: bill });
    } catch (error) {
      console.error("Error fetching bill:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
//update bill
exports.updateBill = async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Bill not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const deleted = await Bill.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    res.status(200).json({ success: true, message: "Bill deleted" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


