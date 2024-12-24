const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        taskerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tasker',
            required: true,
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5, // Assuming a 5-star rating system
        },
        comments: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
