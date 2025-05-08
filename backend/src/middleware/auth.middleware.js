import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import the User model

/* For reference, this is how you would use the token in a fetch request
const response = await fetch('http://localhost:3000/api/books', {
    method: 'POST',
    body: JSON.stringify({
        title,
        caption,
    }),
    headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
    },
});
*/

const protectRoute = async (req, res, next) => {
    let token;

    try {
        // get token
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Unauthorized tokenm, access denied!" });

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "Unauthorized token, access denied!" });
        req.user = user; // Attach the user to the request object for later use
        next(); // Call the next middleware or route handler

    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ message: "Token is not valid" });
    }
}

export default protectRoute; // Export the middleware function for use in other files