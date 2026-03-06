const db = require("../config/db");

exports.getVegetableDetails = (req, res) => {

    const vegetableId = req.params.id;
    const lang = req.query.lang || "en";

    let query;

    if (lang === "te") {

        query = `
        SELECT 
            soil_type_te AS soil_type,
            season_te AS season,
            market_price,
            seed_price
        FROM vegetable_details
        WHERE vegetable_id = ?
        `;

    } else {

        query = `
        SELECT 
            soil_type,
            season,
            market_price,
            seed_price
        FROM vegetable_details
        WHERE vegetable_id = ?
        `;

    }

    db.query(query, [vegetableId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }

        res.json(result[0]);
    });
};