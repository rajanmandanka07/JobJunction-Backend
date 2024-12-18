// controllers/requestPendingController.js
const RequestPending = require('../models/pendingRequestModel');
const Task = require('../models/taskModel');
const User = require("../models/userModel");
const Service = require('../models/serviceModel');

const createRequest = async (req, res) => {
    try {
        const { taskId, taskName, taskCategory, taskPrice, taskDescription, timeSlot, date, area, address } = req.body;
        // Validate that the task exists
        const task = await Task.findOne({ id: taskId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if(task.title !== taskName && task.category !== taskCategory && task.price !== taskPrice) {
            return res.status(400).json({ success: false, message: 'Task values are incorrect' });
        }
        // Create a new request
        const newRequest = new RequestPending({
            taskId,
            taskName,
            taskCategory,
            taskDescription,
            taskPrice,
            timeSlot,
            date,
            area,
            address,
            userId: req.user.id, // From the authenticated user
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request created successfully', data: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token
        const role = req.user.role; // Extract role from token

        if (role === 'user') {
            // Logic for users
            const pendingRequests = await RequestPending.find({ userId });

            if (!pendingRequests.length) {
                return res.status(404).json({ success: false, message: 'No pending requests found' });
            }

            return res.status(200).json({ success: true, data: pendingRequests });
        } else if (role === 'tasker') {
            // Fetch tasker's services
            const taskerServices = await Service.findOne({ taskerId: userId });

            if (!taskerServices) {
                return res.status(404).json({ success: false, message: 'Tasker services not found' });
            }

            // Extract the tasker's area and services offered
            const taskerArea = await User.findOne({ _id: userId }).select('area');
            if (!taskerArea) {
                return res.status(404).json({ success: false, message: 'Tasker area not found' });
            }

            const serviceNames = taskerServices.services.map(service => service.name);

            // Fetch requests that match the tasker's area and services offered
            const matchingRequests = await RequestPending.find({
                area: taskerArea.area, // Match tasker's area
                taskName: { $in: serviceNames }, // Match task categories to tasker's services
                status: 'pending', // Ensure the requests are still pending
            });

            if (!matchingRequests.length) {
                return res.status(404).json({ success: false, message: 'No matching requests found' });
            }

            return res.status(200).json({ success: true, data: matchingRequests });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { createRequest, getPendingRequests};
