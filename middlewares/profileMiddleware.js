// src/middlewares/profileMiddleware.js
const User = require('../models/userModel');

// Middleware to validate profile update input
const validateProfileUpdate = (req, res, next) => {
    const { firstName, lastName, phone, area, services } = req.body;

    // Ensure at least one field is provided for update
    if (!firstName && !lastName && !phone && !area && !services) {
        return res.status(400).json({
            success: false,
            message: 'At least one field must be provided for update.',
        });
    }

    next();
};

// Middleware to check if the user exists based on the token
const checkUserExists = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assuming `req.user` is populated by `authenticateToken`
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        req.userData = user; // Attach user data to the request object
        next();
    } catch (error) {
        console.error('Error in checkUserExists middleware:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    validateProfileUpdate,
    checkUserExists,
};
