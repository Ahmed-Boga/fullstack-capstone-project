// const express = require('express');
const { ObjectId } = require('mongodb'); // Import ObjectId to work with MongoDB IDs
// const router = express.Router();
// const connectToDatabase = require('./path/to/database/connection'); // Adjust path as needed

// Separate function to retrieve all gifts
async function fetchAllGifts() {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    return collection.find({}).toArray();
}

// Route handler for fetching all gifts
router.get('/', async (req, res) => {
    try {
        const gifts = await fetchAllGifts();

        if (!gifts.length) {
            return res.status(404).json({ message: 'No gifts found' });
        }

        res.json(gifts);
    } catch (error) {
        console.error('Error fetching gifts:', error);
        res.status(500).json({ error: 'An internal server error occurred while fetching gifts' });
    }
});

// Route handler for fetching a gift by ID
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const giftId = req.params.id;

        // Convert ID to ObjectId to ensure valid querying
        if (!ObjectId.isValid(giftId)) {
            return res.status(400).json({ message: 'Invalid gift ID format' });
        }

        const gift = await collection.findOne({ _id: new ObjectId(giftId) });

        if (!gift) {
            return res.status(404).json({ message: 'Gift not found' });
        }

        res.json(gift);
    } catch (error) {
        console.error('Error fetching gift:', error);
        res.status(500).json({ error: 'An internal server error occurred while fetching the gift' });
    }
});

// Route handler for adding a new gift
router.post('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const result = await collection.insertOne(req.body);

        if (!result.acknowledged) {
            return res.status(500).json({ message: 'Failed to add the gift' });
        }

        res.status(201).json({ message: 'Gift added successfully', gift: result.ops[0] });
    } catch (error) {
        console.error('Error adding new gift:', error);
        res.status(500).json({ error: 'An internal server error occurred while adding the gift' });
    }
});

module.exports = router;
