// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    area: { type: String, required: true },
    role: { type: String, enum: ['user', 'tasker'], required: true }, // 'user' or 'tasker'
});

const User = mongoose.model('User', userSchema);
module.exports = User;
