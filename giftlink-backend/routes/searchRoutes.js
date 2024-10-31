/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Initialize the query object
        const query = {};

        // Apply filters if query parameters are provided
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name.trim(), $options: "i" }; // Case-insensitive partial match
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            const age = parseInt(req.query.age_years);
            if (!isNaN(age)) {
                query.age_years = { $lte: age }; // Only add if age_years is a valid number
            }
        }

        // Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
