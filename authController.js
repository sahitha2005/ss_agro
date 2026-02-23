const User = require('../models/userModel');

// REGISTER
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters'
    });
  }

  User.findUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    User.createUser({ name, email, password }, (err) => {
      if (err) return res.status(500).json({ message: 'Registration failed' });

      res.json({ message: 'User registered successfully' });
    });
  });
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (result[0].password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: result[0].name
    });
  });
};
