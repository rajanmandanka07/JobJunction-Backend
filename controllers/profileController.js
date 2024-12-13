const User = require('../models/userModel');
const Service = require('../models/serviceModel');

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from token by middleware
        const { firstName, lastName, phone, area, services, email, role } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the email in the request body matches the one in the database
        if (email && email !== user.email) {
            return res.status(400).json({
                success: false,
                message: 'Email does not match the registered email.',
            });
        }

        // Check if the role in the request body matches the one in the database
        if (role && role !== user.role) {
            return res.status(400).json({
                success: false,
                message: 'Role does not match the registered role.',
            });
        }

        // Update user fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (area) user.area = area;

        // Save updated user
        await user.save();

        // Handle Tasker-specific updates
        if (user.role === 'tasker' && services) {
            // Check if the tasker already has a service entry
            let taskerServices = await Service.findOne({ taskerId: userId });

            if (taskerServices) {
                // Update services for the tasker
                taskerServices.services = services;
                await taskerServices.save();
            } else {
                // Create a new service entry for the tasker
                await Service.create({
                    taskerId: userId,
                    services,
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from token by middleware
        const role = req.user.role;

        // Find the user by ID
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If the role is 'tasker', also fetch their services
        let responseData = { ...user.toObject() };
        if (role === 'tasker') {
            const services = await Service.findOne({ taskerId: userId }).select('services');
            responseData.services = services ? services.services : [];
        }

        res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: responseData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { updateProfile, getProfile };
