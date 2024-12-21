// controllers/requestPendingController.js
const RequestPending = require('../models/pendingRequestModel');
const RequestAccepted = require('../models/requestAcceptedModel');
const Task = require('../models/taskModel');
const User = require("../models/userModel");
const Service = require('../models/serviceModel');

const createRequest = async (req, res) => {
    try {
        const { taskId, taskDescription, timeSlot, date, area, address } = req.body;
        // Validate that the task exists
        const task = await Task.findOne({ id: taskId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Create a new request
        const newRequest = new RequestPending({
            taskId,
            taskName : task.title,
            taskCategory : task.category,
            taskDescription,
            taskPrice : task.price,
            taskImage : task.image,
            timeSlot,
            date,
            area,
            address,
            userId: req.user.id,
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request created successfully', data: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        if (role === 'user') {
            const pendingRequests = await RequestPending.find({ userId });

            if (!pendingRequests.length) {
                return res.status(404).json({ success: false, message: 'No pending requests found' });
            }

            return res.status(200).json({ success: true, data: pendingRequests });
        } else if (role === 'tasker') {
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

            // Get all requests already accepted by the tasker
            const taskerAcceptedRequests = await RequestAccepted.find({ taskerId: userId }).select('timeSlot date');

            // Exclude requests with the same `timeSlot` and `date` as existing accepted requests
            const excludedRequestsCondition = {
                $nor: taskerAcceptedRequests.map(({ timeSlot, date }) => ({ timeSlot, date })),
            };

            // Fetch requests that match the tasker's area, services offered, and do not have conflicting time slots
            const matchingRequests = await RequestPending.find({
                area: taskerArea.area, // Match tasker's area
                taskName: { $in: serviceNames }, // Match task categories to tasker's services
                status: 'pending', // Ensure the requests are still pending
                ...excludedRequestsCondition, // Exclude conflicting requests
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
