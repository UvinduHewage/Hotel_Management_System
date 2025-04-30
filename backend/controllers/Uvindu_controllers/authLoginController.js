const User = require('../../models/Uvindu_models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const signup = async (req, res) => {
  const { username, email, password, adminCode } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if admin code is provided and valid
    let role = 'user';
    if (adminCode && adminCode === process.env.ADMIN_SECRET_CODE) {
      role = 'admin';
    }
    
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword,
      role
    });
    
    await user.save();
    res.status(201).json({ 
      message: 'User created successfully', 
      isAdmin: role === 'admin'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login User - remains the same
const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Verify Token - remains the same
const verifyToken = (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, userId: decoded.id, role: decoded.role });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ valid: false });
  }
};

module.exports = { signup, login, verifyToken };