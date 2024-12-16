const express = require('express');
const router = express.Router();
const {getAllTasks} = require("../controllers/taskController");
const {createRequest, getPendingRequestsByUserId } = require("../controllers/pendingRequestController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get('/get-all-task', getAllTasks);
router.post('/create-request', authenticateToken, createRequest);
router.get('/user-pending-requests', authenticateToken, getPendingRequestsByUserId);

module.exports = router;