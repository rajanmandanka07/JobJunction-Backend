// models/RequestPending.js
const mongoose = require('mongoose');

const RequestPendingSchema = new mongoose.Schema({
    taskId: { type: String, required: true },
    taskName: { type: String, required: true },
    taskCategory: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskPrice: { type: String, required: true },
    timeSlot: { type: String, required: true },
    date: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' }, // Default status is pending
}, { timestamps: true });

module.exports = mongoose.model('RequestPending', RequestPendingSchema);
