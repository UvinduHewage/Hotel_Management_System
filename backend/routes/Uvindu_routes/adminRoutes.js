// routes/Uvindu_routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../../middleware/authMiddleware');
const User = require('../../models/Uvindu_models/User');

// Get all users (admin only)
router.get('/users', isAuth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', isAuth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User role updated', user });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard data (example)
router.get('/dashboard', isAuth, isAdmin, (req, res) => {
  res.json({
    message: 'Admin dashboard data',
    admin: req.user,
    stats: {
      activeUsers: 120,
      newSignups: 15,
      totalUsers: 500
    }
  });
});

module.exports = router;