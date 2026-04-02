const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const vegRoutes = require('./routes/vegRoutes'); // <-- Add this import
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/veg', vegRoutes); // <-- Add this route
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`View Authentication page at http://localhost:${PORT}/html/auth.html`);
});
