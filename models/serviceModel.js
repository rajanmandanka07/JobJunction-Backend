// src/models/serviceModel.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    taskerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    services: [
        {
            name: { type: String, required: true },
            rate: { type: String, required: true },
        },
    ],
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
