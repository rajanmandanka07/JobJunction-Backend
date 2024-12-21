const RequestPending = require('../models/pendingRequestModel');
const RequestAccepted = require('../models/requestAcceptedModel');

const acceptTaskRequest = async (req, res) => {
    try {
        const taskerId = req.user.id;
        const { taskId } = req.body;

        // Fetch the pending task by taskId
        const pendingTask = await RequestPending.findOne({ taskId });
        if (!pendingTask) {
            return res.status(404).json({ message: 'Task not found in pending requests' });
        }

        // Create a new accepted request with taskerId
        const acceptedTask = new RequestAccepted({
            taskId: pendingTask.taskId,
            taskName: pendingTask.taskName,
            taskCategory: pendingTask.taskCategory,
            taskDescription: pendingTask.taskDescription,
            taskPrice: pendingTask.taskPrice,
            taskImage: pendingTask.taskImage,
            timeSlot: pendingTask.timeSlot,
            date: pendingTask.date,
            area: pendingTask.area,
            address: pendingTask.address,
            userId: pendingTask.userId,
            taskerId: taskerId, // Adding the tasker's ID
        });

        // Save the accepted task
        await acceptedTask.save();

        // Delete the task from pending requests
        await RequestPending.deleteOne({ taskId });

        res.status(201).json({ message: 'Task accepted successfully', acceptedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { acceptTaskRequest};