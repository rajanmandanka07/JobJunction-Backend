const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
}, { collection: 'tasks' }); // Ensure it maps to the correct MongoDB collection

module.exports = mongoose.model('Task', taskSchema);
