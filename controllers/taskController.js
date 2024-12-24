const Task = require('../models/taskModel');
const CompletedTask = require('../models/completedTaskModel');
const CancelTask = require('../models/cancelTaskModel');
const RequestAccepted = require('../models/acceptedRequestModel');
const Feedback = require('../models/feedbackModel');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}, '-_id'); // Retrieve all tasks excluding the MongoDB `_id` field
        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve tasks.',
            error: error.message,
        });
    }
};

const getCompletedTasks = async (req, res) => {
    try {
        const { userId, role } = req.body;

        // Validate inputs
        if (!userId || !role) {
            return res.status(400).json({ message: 'UserId and role are required.' });
        }

        // Determine query filter based on role
        let filter = {};
        if (role === 'tasker') {
            filter.taskerId = userId;
        } else if (role === 'user') {
            filter.userId = userId;
        } else {
            return res.status(400).json({ message: 'Invalid role. Role must be either "user" or "tasker".' });
        }

        // Ensure the status is "completed"
        filter.status = 'completed';

        // Fetch completed tasks from the database
        const completedTasks = await CompletedTask.find(filter).exec();

        // Return the completed tasks
        return res.status(200).json({ completedTasks });
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
        return res.status(500).json({ message: 'Internal server error.', error });
    }
};

const getCanceledTask = async (req, res) => {
    try {
        const { userId, role } = req.body;

        // Validate inputs
        if (!userId || !role) {
            return res.status(400).json({ message: 'UserId and role are required.' });
        }

        // Determine query filter based on role
        let filter = {};
        if (role === 'tasker') {
            filter.taskerId = userId;
        } else if (role === 'user') {
            filter.userId = userId;
        } else {
            return res.status(400).json({ message: 'Invalid role. Role must be either "user" or "tasker".' });
        }

        // Ensure the status is "canceled"
        filter.status = 'canceled';

        // Fetch canceled tasks from the database
        const canceledTasks = await CancelTask.find(filter).exec();

        // Return the canceled tasks
        return res.status(200).json({ canceledTasks });
    } catch (error) {
        console.error('Error fetching canceled tasks:', error);
        return res.status(500).json({ message: 'Internal server error.', error });
    }
};

const getAcceptedTask = async (req, res) => {
    try {
        const { userId, role } = req.body;

        // Validate inputs
        if (!userId || !role) {
            return res.status(400).json({ message: 'UserId and role are required.' });
        }

        // Determine query filter based on role
        let filter = {};
        if (role === 'tasker') {
            filter.taskerId = userId;
        } else if (role === 'user') {
            filter.userId = userId;
        } else {
            return res.status(400).json({ message: 'Invalid role. Role must be either "user" or "tasker".' });
        }

        // Ensure the status is "accepted"
        filter.status = 'accepted';

        // Fetch accepted tasks from the database
        const acceptedTasks = await RequestAccepted.find(filter).exec();

        // Return the accepted tasks
        return res.status(200).json({ acceptedTasks });
    } catch (error) {
        console.error('Error fetching accepted tasks:', error);
        return res.status(500).json({ message: 'Internal server error.', error });
    }
};

const getFeedBack = async (req, res) => {
    try {
        const { taskId } = req.body;

        // Validate inputs
        if (!taskId) {
            return res.status(400).json({ message: 'TaskId is required.' });
        }

        // Fetch feedback from the database
        const feedback = await Feedback.find({ taskId })
            .populate('userId', 'name')
            .populate('taskerId', 'name')
            .exec();

        // Return the feedback
        return res.status(200).json({ feedback });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return res.status(500).json({ message: 'Internal server error.', error });
    }
};

module.exports = { getAllTasks, getAcceptedTask, getCompletedTasks, getCanceledTask, getFeedBack };