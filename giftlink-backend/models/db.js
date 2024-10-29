// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;

// console.log("MongoDB URL:", url); // Add this line to check the connection string

const dbName = "giftdb";
let dbInstance = null;

// MongoDB connection options
// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// };

async function connectToDatabase() {
    try {
        if (dbInstance) {
            return dbInstance;
        }

        const client = new MongoClient(url);

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
