import express from 'express';
import "dotenv/config";
import authRoutes from './routes/authRoutes.js'; // Import the auth routes
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

//console.log({ PORT }); // Check if PORT is set
app.use("/api/auth",authRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Connect to the database when the server starts
  console.log("Database connected successfully !!!")
});