const jwt = require('jsonwebtoken');

require('dotenv').config();

const { ACCESS_TOKEN_SECRET } = process.env;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("FATAL ERROR: ACCESS_TOKEN_SECRET is not defined in .env file.")
}

/**
 * @middleware authMiddleware
 * Verifies the JWT Access Token from the Authorization  header.
 * If valid, it attaches the user's payload to req.user.
 * If invalid, it sends a 401 Unauthorized response.
 */

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access denied. No token provided or format is incorrect (Bearer <token>).',
        });
    }

    try {
        // Get the token part from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Verify the token using your ACCESS_TOKEN_SECRET
        // This will throw an error if the token is invalid or expired
        const decodedPayload = jwt.verify(token, ACCESS_TOKEN_SECRET);

        req.user = decodedPayload; // The payload *is* the user object



        next();
    } catch (error) {

        //FAILURE: The token is invalid (expired, wrong signature, etc.)
        res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
};



module.exports = authMiddleware