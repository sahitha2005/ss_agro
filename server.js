const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

const app = express();

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