const mongoose = require('mongoose');

const RequestAcceptedSchema = new mongoose.Schema({
    taskId: { type: String, required: true },
    taskName: { type: String, required: true },
    taskCategory: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskPrice: { type: String, required: true },
    taskImage: { type: String, required: true },
    timeSlot: { type: String, required: true },
    date: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the tasker
    status: { type: String, default: 'accepted' }, // Default status is accepted
}, { timestamps: true });

module.exports = mongoose.model('RequestAccepted', RequestAcceptedSchema);
