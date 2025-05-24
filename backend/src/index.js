// Import Express, a minimal web framework for Node.js
import express from 'express';

import cors from 'cors'; // Import CORS middleware for handling cross-origin requests

// Import dotenv for managing environment variables
import "dotenv/config";

import job from './lib/cron.js'; // Import the cron job for scheduled tasks

import authRoutes from './routes/authRoutes.js'; // Import authentication-related routes from the authRoutes file
import bookRoutes from './routes/bookRoutes.js'; // Import book-related routes

// Import the function to connect to the database
import { connectDB } from './lib/db.js';

// Initialize an Express application instance
const app = express();

// Define the server's port, using the value from environment variables or defaulting to 3000
const PORT = process.env.PORT || 3000; 

job.start(); // Start the cron job to run at specified intervals
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Use the authentication routes under the `/api/auth` endpoint
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Connect to the database when the server starts
    connectDB();

    // Log a message when the database connection function is called
    console.log("Database connected successfully !!!");
});