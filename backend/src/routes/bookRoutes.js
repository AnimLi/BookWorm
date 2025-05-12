import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';    // Assuming you have a Book model defined in models/Book.js
import protectRoute from '../middleware/auth.middleware.js'; // Import the authentication middleware

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
    try {
        
        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        
        //save to the datebase
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl, // Use the secure URL from Cloudinary
            user: req.user._id, // Assuming you have user authentication and req.user is set
        });

        // Assuming you have a function to save the book to your database
        await newBook.save();
        res.status(201).json({ message: 'Book created successfully', book: newBook });

    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get all books, pagination => infinite loading
router.get("/", protectRoute, async (req, res) => {
    //example call from react native - frontend
    // const response = await fetch('http://localhost:5000/api/books?page=1&limit=5');
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters
        const limit = req.query.limit || 5; // Number of books per page
        const skip = (page - 1) * limit; // Calculate the number of books to skip

        const books = await Book.find()
        .sort ({ createdAt: -1 }) //descending order
        .skip(skip) // Skip the books for pagination
        .limit(limit) // Limit the number of books returned
        .poplulate("user", "username profileImage"); // Populate the user field with user data

        const totalBooks = await Book.countDocuments(); // Get the total number of books

        res.send({
            books,
            currentPage,
            totalBooks: await Book.countDocuments(), // Get the total number of books
            totalPages: Math.ceil(totalBooks / limit), // Calculate the total number of pages
        });

    } catch (error) {
        console.error('Error in get all books route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//delete a book
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        // Check if the user is authorized to delete the book
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        //check if user is the creator of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'You are not authorized to delete this book' });
        }

        //delete the image from cloudinary
        if(book.image && book.image.includes('cloudinary')) {
            // Assuming the image URL is in the format: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg
            try {
                const publicId = book.image.split('/').pop().split('.')[0]; // Extract the public ID from the URL
                await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary
                console.log('Image deleted from Cloudinary:', publicId);
            } catch (deleteError) {
                console.error('Error deleting image from Cloudinary:', deleteError);
                return res.status(500).json({ message: 'Failed to delete image from Cloudinary' });
                
            }
        }

        //delete the book from the database
        await book.deleteOne();

        res.json({ message: 'Book deleted successfully' });

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get recommended books by logged in user
router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
        .sort({ createdAt: -1 }); // Sort by creation date

        res.json(books);

    } catch (error) {
        console.error('Error in get recommended books route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;