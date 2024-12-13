const express = require('express');
const router = express.Router();
const {getAllTasks} = require("../controllers/taskController");
const {createRequest} = require("../controllers/pendingRequestController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get('/get-all-task', getAllTasks);
router.post('/create-request', authenticateToken, createRequest);

module.exports = router;