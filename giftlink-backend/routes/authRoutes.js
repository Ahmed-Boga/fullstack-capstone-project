// Import necessary packages
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const pino = require('pino'); 
const connectToDatabase = require('../models/db');

dotenv.config();
const router = express.Router();
const logger = pino();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Validate environment variables
if (!JWT_SECRET) {
    logger.error("Missing JWT_SECRET environment variable.");
    process.exit(1);
}

// Registration route
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
    ],
    async (req, res) => {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Connect to database
            const db = await connectToDatabase();
            const collection = db.collection("users");

            // Check if the email already exists
            const { email, password, firstName, lastName } = req.body;
            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                logger.warn(`Attempt to register with an existing email: ${email}`);
                return res.status(400).json({ message: 'Email already in use' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            const newUser = await collection.insertOne({
                email,
                firstName,
                lastName,
                password: hashedPassword,
                createdAt: new Date(),
            });

            // Create JWT
            const payload = { user: { id: newUser.insertedId } };
            const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            logger.info(`User registered successfully: ${email}`);
            res.json({ authToken, email });
        } catch (error) {
            logger.error(`Registration error: ${error.message}`);
            res.status(500).send('Internal server error');
        }
    }
);

module.exports = router;
