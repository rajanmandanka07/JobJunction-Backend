const mongoose = require('mongoose');

const CompletedTaskSchema = new mongoose.Schema({
    taskId: { type: String, required: true },
    taskTitle: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskImage: { type: String, required: true },
    taskPrice: { type: String, required: true },
    taskCategory: { type: String, required: true },
    userDescription: { type: String, required: true },
    timeSlot: { type: String, required: true },
    date: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'completed' }, // Default status is completed
}, { timestamps: true });

module.exports = mongoose.model('CompletedTask', CompletedTaskSchema);
