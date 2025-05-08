import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        image:{
            type: String,
            required: true,
        },
        rating:{
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {timestamp: true}, // Automatically manage createdAt and updatedAt fields
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
// This code defines a Mongoose schema and model for a "Book" entity in a MongoDB database.