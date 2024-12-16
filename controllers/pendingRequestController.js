// controllers/requestPendingController.js
const RequestPending = require('../models/pendingRequestModel');
const Task = require('../models/taskModel');

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

const getPendingRequestsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const pendingRequests = await RequestPending.find({ userId });

        if (!pendingRequests.length) {
            return res.status(404).json({ success: false, message: 'No pending requests found' });
        }

        res.status(200).json({ success: true, data: pendingRequests });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { createRequest, getPendingRequestsByUserId};
