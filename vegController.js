const db = require('../config/db');

exports.getAllVegetables = async (req, res) => {
    try {
        // Fetch all vegetables from the database
        const [rows] = await db.execute('SELECT * FROM vegetables');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).json({ error: 'Failed to fetch vegetables' });
    }
};
// Add this below your existing getAllVegetables function
exports.getVegetableById = async (req, res) => {
    const vegId = req.params.id;

    try {
        // We use a LEFT JOIN to get data from both tables at once
        const query = `
            SELECT v.veg_id, v.name, v.price, v.image_url, 
                   d.season, d.country, d.duration 
            FROM vegetables v
            LEFT JOIN vegetable_details d ON v.veg_id = d.veg_id
            WHERE v.veg_id = ?
        `;
        
        const [rows] = await db.execute(query, [vegId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Vegetable not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).json({ error: 'Failed to fetch vegetable details' });
    }
};
// Fetch fertilizer details by Vegetable ID
exports.getFertilizerByVegId = async (req, res) => {
    const vegId = req.params.id;

    if (isNaN(vegId)) {
        return res.status(400).json({ error: 'Invalid vegetable ID' });
    }

    try {
        const query = 'SELECT fertilizer_name, instructions FROM fertilizers WHERE veg_id = ?';
        const [rows] = await db.execute(query, [vegId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Fertilizer details not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).json({ error: 'Failed to fetch fertilizer details' });
    }
};

