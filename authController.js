const db = require('../config/db');
const bcrypt = require('bcrypt');

// SIGNUP LOGIC
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert into database
        const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        await db.execute(query, [email, username, hashedPassword]);
        
        res.status(201).json({ message: 'User registered successfully!' });
        } catch (error) {
        // ADD THIS LINE: Print the exact error to your terminal
        console.error("Exact MySQL Error: ", error); 

        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists!' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }

};

// LOGIN LOGIC
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ 
            message: 'Login successful!', 
            user: { email: user.email, username: user.username, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};
