// src/routes/authRoutes.js
const express = require('express');
const { login, register } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validationMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ success: true, message: 'Access granted' });
});

module.exports = router;
