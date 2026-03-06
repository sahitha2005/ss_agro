exports.getVegetableDetails = (req, res) => {

    const vegetableId = req.params.id;
    const lang = req.query.lang || "en";

    const query = `
        SELECT 
            ${lang === "te" ? "soil_type_te AS soil_type" : "soil_type"},
            ${lang === "te" ? "season_te AS season" : "season"},
            market_price,
            seed_price
        FROM vegetable_details
        WHERE vegetable_id = ?
    `;

    db.query(query, [vegetableId], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No details found" });
        }

        res.json(result[0]);
    });
};