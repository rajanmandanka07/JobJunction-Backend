// src/controllers/authController.js
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT secret key (use environment variable for production)
const JWT_SECRET = process.env.JWT_SECRET || 'sdnvkasdnviwneopfqopwojefklsnc12948823yfiwebcjqn';

// Register function
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, area, role, services } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the common User record
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            area,
            role,
        });

        // If role is tasker, store services in the Service collection
        if (role === 'tasker') {
            if (!services || services.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tasker must provide at least one service.',
                });
            }

            await Service.create({
                taskerId: user._id,
                services,
            });
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { id: user._id, role: user.role },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const role = user.role;
        res.status(200).json({
            success: true,
            message: 'Login successful',
            role,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { register, login };
