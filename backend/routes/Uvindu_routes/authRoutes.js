const express = require('express');
const router = express.Router();
const { signup, login, verifyToken } = require('../../controllers/Uvindu_controllers/authLoginController');

// Route for user registration
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route to verify token
router.get('/verify', verifyToken);

module.exports = router;