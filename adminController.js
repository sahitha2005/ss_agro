const db = require('../config/db');

exports.getAllOrders = async (req, res) => {
    try {
        // Fetch all orders and join with vegetables table to get the vegetable name
        const query = `
            SELECT o.order_id, o.buyer_name, o.user_email, o.shipping_address, 
                   o.quantity, o.total_price, o.order_date, v.name AS vegetable_name
            FROM orders o
            JOIN vegetables v ON o.veg_id = v.veg_id
            ORDER BY o.order_date DESC
        `;
        
        const [rows] = await db.execute(query);
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("Admin DB Error: ", error);
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
};

// Add a new vegetable
exports.addVegetable = async (req, res) => {
    const { name, price, image_url, season, country, duration } = req.body;

    try {
        // 1. Insert into vegetables table
        const query = 'INSERT INTO vegetables (name, price, image_url) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [name, price, image_url]);
        const vegId = result.insertId;
        
        // 2. Insert into vegetable_details
        const detailsQuery = 'INSERT INTO vegetable_details (veg_id, season, country, duration) VALUES (?, ?, ?, ?)';
        await db.execute(detailsQuery, [vegId, season || null, country || null, duration || null]);

        // 3. Insert a default fertilizer entry so it can be edited later
        const fertQuery = 'INSERT INTO fertilizers (veg_id, fertilizer_name, instructions) VALUES (?, ?, ?)';
        await db.execute(fertQuery, [vegId, 'Default Fertilizer', 'No instructions yet.']);
        
        res.status(201).json({ message: 'Vegetable added successfully!', veg_id: result.insertId });
    } catch (error) {
        console.error("Add Error: ", error);
        res.status(500).json({ error: 'Database error while adding vegetable.' });
    }
};

// Add this below your existing getAllOrders function
exports.updateVegetable = async (req, res) => {
    const vegId = req.params.id;
    const { name, price, image_url, season, country, duration } = req.body;

    try {
        const query = 'UPDATE vegetables SET name = ?, price = ?, image_url = ? WHERE veg_id = ?';
        await db.execute(query, [name, price, image_url, vegId]);
        
        // Update or Insert into vegetable_details
        const checkDetails = 'SELECT veg_id FROM vegetable_details WHERE veg_id = ?';
        const [rows] = await db.execute(checkDetails, [vegId]);
        
        if (rows.length > 0) {
            const updateDetails = 'UPDATE vegetable_details SET season = ?, country = ?, duration = ? WHERE veg_id = ?';
            await db.execute(updateDetails, [season || null, country || null, duration || null, vegId]);
        } else {
            const insertDetails = 'INSERT INTO vegetable_details (veg_id, season, country, duration) VALUES (?, ?, ?, ?)';
            await db.execute(insertDetails, [vegId, season || null, country || null, duration || null]);
        }

        res.status(200).json({ message: 'Vegetable updated successfully!' });
    } catch (error) {
        console.error("Update Error: ", error);
        res.status(500).json({ error: 'Failed to update vegetable.' });
    }
};

// DELETE a vegetable
exports.deleteVegetable = async (req, res) => {
    const vegId = req.params.id;
    try {
        // Delete related details and fertilizers to avoid foreign key constraints
        await db.execute('DELETE FROM vegetable_details WHERE veg_id = ?', [vegId]);
        await db.execute('DELETE FROM fertilizers WHERE veg_id = ?', [vegId]);
        
        const query = 'DELETE FROM vegetables WHERE veg_id = ?';
        await db.execute(query, [vegId]);
        res.status(200).json({ message: 'Vegetable deleted successfully!' });
    } catch (error) {
        console.error("Vegetable Delete Error: ", error);
        res.status(500).json({ error: 'Failed to delete vegetable. Ensure no orders are referencing it.' });
    }
};

// DELETE an order
exports.deleteOrder = async (req, res) => {
    const orderId = req.params.id;
    try {
        const query = 'DELETE FROM orders WHERE order_id = ?';
        await db.execute(query, [orderId]);
        res.status(200).json({ message: 'Order deleted successfully!' });
    } catch (error) {
        console.error("Order Delete Error: ", error);
        res.status(500).json({ error: 'Failed to delete order.' });
    }
};

// UPDATE fertilizer details
exports.updateFertilizer = async (req, res) => {
    const vegId = req.params.id;
    const { fertilizer_name, instructions } = req.body;
    try {
        const query = 'UPDATE fertilizers SET fertilizer_name = ?, instructions = ? WHERE veg_id = ?';
        await db.execute(query, [fertilizer_name, instructions, vegId]);
        res.status(200).json({ message: 'Fertilizer updated successfully!' });
    } catch (error) {
        console.error("Fertilizer Update Error: ", error);
        res.status(500).json({ error: 'Failed to update fertilizer.' });
    }
};
