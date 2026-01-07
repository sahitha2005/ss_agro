const User = require('../models/userModel');

// ================= REGISTER =================
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // 1️⃣ Check empty fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // 2️⃣ Password length validation
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 8 characters' });
  }

  // 3️⃣ Check if email already exists
  User.findUserByEmail(email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 4️⃣ Create new user
    User.createUser({ name, email, password }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Registration failed' });
      }

      res.json({ message: 'User registered successfully' });
    });
  });
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Check empty fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // 2️⃣ Find user by email
  User.findUserByEmail(email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 3️⃣ Check password
    if (result[0].password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 4️⃣ Success
    res.json({
      message: 'Login successful',
      user: result[0].name
    });
  });
};
