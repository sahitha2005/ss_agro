const db = require('../config/db');
const twilio = require('twilio');

// Initialize Twilio credentials
const accountSid = 'AC319dafd715016fadc80df224aa13e77e'; 
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';       // <-- Paste your secret token here
const twilioPhoneNumber = '637'; // <-- Paste your Twilio virtual number here

// Create Twilio client
const client = new twilio(accountSid, authToken);

exports.placeOrder = async (req, res) => {
    // Destructure all expected fields
    const { user_email, veg_id, buyer_name, phone_number, shipping_address, quantity, total_price } = req.body;

    // DEBUGGING: This will print the exact data the frontend sent to your terminal!
    console.log("Incoming Order Data:", req.body);

    // Strict validation check for undefined or empty values
    if (!user_email || !veg_id || !buyer_name || !phone_number || !shipping_address || !quantity || !total_price) {
        console.log("Validation Failed: Missing a required field.");
        return res.status(400).json({ error: 'All fields, including phone number, are required.' });
    }

    try {
        // 1. Insert the order into the database
        const query = `
            INSERT INTO orders (user_email, veg_id, buyer_name, phone_number, shipping_address, quantity, total_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.execute(query, [user_email, veg_id, buyer_name, phone_number, shipping_address, quantity, total_price]);
        
        // ... (Keep your existing Twilio SMS code below here)

        
        // 2. Send the SMS Confirmation via Twilio
        try {
            await client.messages.create({
                body: `Exotic VegStore: Hi ${buyer_name}, your order has been confirmed! Total: $${total_price}. Thank you for shopping with us!`,
                from: twilioPhoneNumber, // Your Twilio number
                to: phone_number         // The customer's number from the checkout form
            });
            console.log(`SMS successfully sent to ${phone_number}`);
        } catch (smsError) {
            // We catch SMS errors separately so the order still completes even if the text fails
            console.error("Twilio SMS Error: ", smsError.message);
        }

        // 3. Respond to the frontend
        res.status(201).json({ message: 'Order placed successfully!' });

    } catch (error) {
        console.error("Order Database Error: ", error);
        res.status(500).json({ error: 'Failed to place order. Please try again.' });
    }
};
