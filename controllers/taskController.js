const Task = require('../models/taskModel');

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

module.exports = { getAllTasks };