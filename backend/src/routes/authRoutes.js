// Import the Express framework
import express from 'express';

import User from '../models/User.js'; // Import the User model for database operations

import jwt from 'jsonwebtoken'; // Import JWT for token generation and verification

// Create an Express router instance
const router = express.Router();

// Generate a JWT token with a 15-day expiration time
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d"}); 
};

// Handle user registration via POST request
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if(username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }

        // Check if the user already exists in the database
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        //ger random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        // Create a new user object
        const user = new User({
            username,
            email,
            password,
            profileImage, // Handle file upload if needed
        }); // Password hashing should be done here

        await user.save(); // Save the new user to the database

        const token = generateToken(user._id); // Generate a token for the user

        res.status(201).json({
            token,
            user:{
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" }); // Send a 500 status code for server errors
    }
});

// Handle user login via POST request
router.post('/login', async (req, res) => {
    // Implement login logic here (e.g., checking credentials)
    res.send("login"); // Fixed typo: Changed 'sned' to 'send'
});

// Export the router for use in other parts of the application
export default router;