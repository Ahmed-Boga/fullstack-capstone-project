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

// Helper function to hash passwords
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Helper function to generate JWT
const generateAuthToken = (userId) => {
    const payload = { user: { id: userId } };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Middleware for validation checks
const validateRegistration = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
];

// Registration route
router.post('/register', validateRegistration, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const { email, password, firstName, lastName } = req.body;

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            logger.warn(`Attempt to register with existing email: ${email}`);
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await collection.insertOne({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            createdAt: new Date(),
        });

        const authToken = generateAuthToken(newUser.insertedId);
        logger.info(`User registered successfully: ${email}`);
        res.json({ authToken, email });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const user = await collection.findOne({ email: req.body.email });

        if (!user) {
            logger.error(`Login failed - user not found: ${req.body.email}`);
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            logger.error(`Login failed - password mismatch for user: ${req.body.email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const authToken = generateAuthToken(user._id);
        logger.info(`User logged in successfully: ${req.body.email}`);
        res.status(200).json({ authToken, userName: user.firstName, userEmail: user.email });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Update route
router.put(
    '/update',
    [
        // Task 1: Input validation for `name`
        body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const email = req.headers.email;
        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        try {
            const db = await connectToDatabase();
            const collection = db.collection('users');

            // Find the user in the database
            const existingUser = await collection.findOne({ email });
            if (!existingUser) {
                logger.error('User not found');
                return res.status(404).json({ error: 'User not found' });
            }

            // Prepare user update data
            const updateData = {
                firstName: req.body.name,
                updatedAt: new Date(),
            };

            // Perform the update and retrieve the updated user document
            const updatedUser = await collection.findOneAndUpdate(
                { email },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!updatedUser.value) {
                logger.error('User update failed');
                return res.status(500).json({ error: 'Failed to update user' });
            }

            // Generate new JWT token
            const payload = { user: { id: updatedUser.value._id.toString() } };
            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User updated successfully');

            res.json({ authtoken });
        } catch (error) {
            logger.error('Internal Server Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

module.exports = router;
