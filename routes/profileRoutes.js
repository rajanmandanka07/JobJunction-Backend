const express = require('express');
const { updateProfile, getProfile } = require('../controllers/profileController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateProfileUpdate, checkUserExists } = require('../middlewares/profileMiddleware');

const router = express.Router();

router.get('/get-profile', authenticateToken, getProfile);
router.put('/update', authenticateToken, validateProfileUpdate, checkUserExists, updateProfile);

module.exports = router;
