const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();

const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');
const detailsRoutes = require("./routes/detailsRoutes");

app.use("/api/details", detailsRoutes);



app.use(cors());
app.use(express.json());

/* ===========================
   AUTH ROUTES
=========================== */
app.use('/api/auth', authRoutes);


/* ===========================
   GET VEGETABLES
=========================== */
app.get('/api/vegetables', (req, res) => {

  const sql = "SELECT * FROM vegetables";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });

});


/* ===========================
   3RD MODULE - GET VEGETABLE DETAILS
=========================== */
app.get('/api/vegetable-details/:id', (req, res) => {

  const vegId = req.params.id;

  const sql = `
    SELECT 
      soil_type,
      soil_type_te,
      season,
      season_te,
      market_price,
      seed_price
    FROM vegetable_details
    WHERE vegetable_id = ?
  `;

  db.query(sql, [vegId], (err, results) => {

    if (err) {
      console.log("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ message: "No details found" });
    }

    res.json(results[0]);

  });

});


/* ===========================
   FREE TRANSLATION
=========================== */
app.post('/api/translate', async (req, res) => {

  const { text } = req.body;

  try {

    const response = await axios.post(
      "https://libretranslate.com/translate",
      {
        q: text,
        source: "en",
        target: "te",
        format: "text"
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Libre Response:", response.data);

    res.json({
      translatedText: response.data.translatedText
    });

  } catch (error) {

    console.log("Translation error:", error.response?.data || error.message);

    res.status(500).json({ message: "Translation failed" });
  }

});


/* ===========================
   DEFAULT ROUTE
=========================== */
app.get('/', (req, res) => {
  res.send('Agroshop Backend Running');
});


/* ===========================
   SERVER START
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});