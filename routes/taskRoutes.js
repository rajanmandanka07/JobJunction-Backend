const express = require('express');
const router = express.Router();
const {getAllTasks} = require("../controllers/taskController");
const {createRequest, getPendingRequests, acceptTaskRequest, completedTaskRequest, cancelTaskRequest } = require("../controllers/taskRequestController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get('/get-all-task', getAllTasks);
router.post('/create-request', authenticateToken, createRequest);
router.get('/pending-requests', authenticateToken, getPendingRequests);
router.post('/accept-task', authenticateToken, acceptTaskRequest);
router.post('/completed-task', authenticateToken, completedTaskRequest);
router.post('/cancel-task', authenticateToken, cancelTaskRequest);

module.exports = router;