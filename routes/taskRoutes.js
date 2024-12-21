const express = require('express');
const router = express.Router();
const {getAllTasks} = require("../controllers/taskController");
const {createRequest, getPendingRequests } = require("../controllers/pendingRequestController");
const {acceptTaskRequest} = require('../controllers/requestAcceptedController')
const authenticateToken = require("../middlewares/authMiddleware");

router.get('/get-all-task', getAllTasks);
router.post('/create-request', authenticateToken, createRequest);
router.get('/pending-requests', authenticateToken, getPendingRequests);
router.post('/accept-task', authenticateToken, acceptTaskRequest);

module.exports = router;