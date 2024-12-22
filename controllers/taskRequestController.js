const RequestPending = require('../models/pendingRequestModel');
const RequestAccepted = require('../models/acceptedRequestModel');
const CompletedTask = require('../models/completedTaskModel');
const CancelTask = require('../models/cancelTaskModel');
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
            taskTitle : task.title,
            taskDescription : task.description,
            taskImage : task.image,
            taskPrice : task.price,
            taskCategory : task.category,
            userDescription : taskDescription,
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
                area: taskerArea.area,
                taskTitle: { $in: serviceNames },
                status: 'pending',
                ...excludedRequestsCondition,
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

const acceptTaskRequest = async (req, res) => {
    try {
        const taskerId = req.user.id;
        const { _id } = req.body;

        // Fetch the task from the pending requests
        const pendingTask = await RequestPending.findById(_id);
        if (!pendingTask) {
            return res.status(404).json({ message: 'Task not found in pending requests' });
        }

        // Create a new accepted task with all details from the pending task
        const acceptedTask = new RequestAccepted({
            taskId: pendingTask.taskId,
            taskTitle: pendingTask.taskTitle,
            taskDescription: pendingTask.taskDescription,
            taskImage: pendingTask.taskImage,
            taskPrice: pendingTask.taskPrice,
            taskCategory: pendingTask.taskCategory,
            userDescription: pendingTask.userDescription,
            timeSlot: pendingTask.timeSlot,
            date: pendingTask.date,
            area: pendingTask.area,
            address: pendingTask.address,
            userId: pendingTask.userId,
            taskerId: taskerId, // Assign the current tasker's ID
        });

        // Save the accepted task to the database
        await acceptedTask.save();

        // Remove the task from pending requests
        await RequestPending.findByIdAndDelete(_id);

        res.status(201).json({ message: 'Task accepted successfully', acceptedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const completedTaskRequest = async (req, res) => {
    try {
        const taskerId = req.user.id;
        const { _id } = req.body; // _id of the accepted task

        // Fetch the task from the accepted requests
        const acceptedTask = await RequestAccepted.findById(_id);
        if (!acceptedTask) {
            return res.status(404).json({ message: 'Task not found in accepted requests' });
        }

        // Create a new completed task with all details from the accepted task
        const completedTask = new CompletedTask({
            taskId: acceptedTask.taskId,
            taskTitle: acceptedTask.taskTitle,
            taskDescription: acceptedTask.taskDescription,
            taskImage: acceptedTask.taskImage,
            taskPrice: acceptedTask.taskPrice,
            taskCategory: acceptedTask.taskCategory,
            userDescription: acceptedTask.userDescription,
            timeSlot: acceptedTask.timeSlot,
            date: acceptedTask.date,
            area: acceptedTask.area,
            address: acceptedTask.address,
            userId: acceptedTask.userId,
            taskerId: taskerId, // Assign the current tasker's ID
        });

        // Save the completed task to the database
        await completedTask.save();

        // Remove the task from accepted requests
        await RequestAccepted.findByIdAndDelete(_id);

        res.status(201).json({ message: 'Task marked as completed successfully', completedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const cancelTaskRequest = async (req, res) => {
    try {
        const userId = req.user.id; // ID of the user or tasker making the cancellation
        const userRole = req.user.role; // Role of the user (e.g., 'user' or 'tasker')
        const { _id, reason } = req.body; // Task ID and reason for cancellation

        let task = null;

        // Logic for users
        if (userRole === 'user') {
            // Check if the task is in pending requests
            task = await RequestPending.findById(_id);
            if (task && task.userId.toString() === userId) {
                // Create a new canceled task from pending requests
                const canceledTask = new CancelTask({
                    taskId: task.taskId,
                    taskTitle: task.taskTitle,
                    taskDescription: task.taskDescription,
                    taskImage: task.taskImage,
                    taskPrice: task.taskPrice,
                    taskCategory: task.taskCategory,
                    userDescription: task.userDescription,
                    timeSlot: task.timeSlot,
                    date: task.date,
                    area: task.area,
                    address: task.address,
                    userId: task.userId,
                    canceledBy: 'user', // Canceled by user
                    reason,
                });

                // Save the canceled task
                await canceledTask.save();

                // Remove the task from pending requests
                await RequestPending.findByIdAndDelete(_id);

                return res.status(201).json({ message: 'Task canceled successfully', canceledTask });
            }

            // Check if the task is in accepted requests
            task = await RequestAccepted.findById(_id);
            if (task && task.userId.toString() === userId) {
                // Create a new canceled task from accepted requests
                const canceledTask = new CancelTask({
                    taskId: task.taskId,
                    taskTitle: task.taskTitle,
                    taskDescription: task.taskDescription,
                    taskImage: task.taskImage,
                    taskPrice: task.taskPrice,
                    taskCategory: task.taskCategory,
                    userDescription: task.userDescription,
                    timeSlot: task.timeSlot,
                    date: task.date,
                    area: task.area,
                    address: task.address,
                    userId: task.userId,
                    taskerId: task.taskerId,
                    canceledBy: 'user', // Canceled by user
                    reason,
                });

                // Save the canceled task
                await canceledTask.save();

                // Remove the task from accepted requests
                await RequestAccepted.findByIdAndDelete(_id);

                return res.status(201).json({ message: 'Task canceled successfully', canceledTask });
            }

            return res.status(404).json({ message: 'Task not found in pending or accepted requests' });
        }

        // Logic for taskers
        if (userRole === 'tasker') {
            // Check if the task is in accepted requests
            task = await RequestAccepted.findById(_id);
            if (task && task.taskerId.toString() === userId) {
                // Create a new canceled task from accepted requests
                const canceledTask = new CancelTask({
                    taskId: task.taskId,
                    taskTitle: task.taskTitle,
                    taskDescription: task.taskDescription,
                    taskImage: task.taskImage,
                    taskPrice: task.taskPrice,
                    taskCategory: task.taskCategory,
                    userDescription: task.userDescription,
                    timeSlot: task.timeSlot,
                    date: task.date,
                    area: task.area,
                    address: task.address,
                    userId: task.userId,
                    taskerId: task.taskerId,
                    canceledBy: 'tasker', // Canceled by tasker
                    reason,
                });

                // Save the canceled task
                await canceledTask.save();

                // Remove the task from accepted requests
                await RequestAccepted.findByIdAndDelete(_id);

                return res.status(201).json({ message: 'Task canceled successfully', canceledTask });
            }

            return res.status(404).json({ message: 'Task not found in accepted requests' });
        }

        // If role is invalid
        return res.status(403).json({ message: 'Unauthorized action for the given role' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createRequest, getPendingRequests, acceptTaskRequest, completedTaskRequest, cancelTaskRequest};
