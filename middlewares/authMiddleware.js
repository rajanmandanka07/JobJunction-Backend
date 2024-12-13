// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sdnvkasdnviwneopfqopwojefklsnc12948823yfiwebcjqn';

const authenticateToken = (req, res, next) => {

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Add user data to the request object
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
