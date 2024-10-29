// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL and options
const url = process.env.MONGO_URL;
const dbName = "giftdb";
let dbInstance = null;

// MongoDB connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

async function connectToDatabase() {
    try {
        if (dbInstance) {
            return dbInstance;
        }

        const client = new MongoClient(url, options);

        // Connect to MongoDB
        await client.connect();

        // Connect to database giftdb and assign to dbInstance
        dbInstance = client.db(dbName);
        console.log("Connected to MongoDB:", dbName);

        return dbInstance;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

module.exports = connectToDatabase;
