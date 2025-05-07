// Import the Mongoose library to interact with MongoDB
import mongoose from 'mongoose';

// Define an asynchronous function to establish a connection to MongoDB
export const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string stored in environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log a success message including the host of the connected database
        console.log('MongoDB connected successfully. Database connected:', conn.connection.host);
    } catch (error) {
        // Catch any errors that occur during the connection process
        console.error('MongoDB connection error:', error);

        // Exit the process with a failure code (1) if a connection error occurs
        process.exit(1);
    }
};