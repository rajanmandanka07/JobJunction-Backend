const express = require('express');
const router = express.Router();
const {getAllTasks, getAcceptedTask, getCompletedTasks, getCanceledTask} = require("../controllers/taskController");
const {createRequest, getPendingRequests, acceptTaskRequest, completedTaskRequest, cancelTaskRequest, feedback } = require("../controllers/taskRequestController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get('/get-all-task', getAllTasks);

router.post('/create-request', authenticateToken, createRequest);
router.get('/pending-requests', authenticateToken, getPendingRequests);

router.post('/accept-task', authenticateToken, acceptTaskRequest);
router.get('/accepted-task', authenticateToken, getAcceptedTask);

router.post('/complete-task', authenticateToken, completedTaskRequest);
router.get('/completed-task', authenticateToken, getCompletedTasks);

router.post('/cancel-task', authenticateToken, cancelTaskRequest);
router.get('/canceled-task', authenticateToken, getCanceledTask);

router.post('/feedback', authenticateToken, feedback)

module.exports = router;