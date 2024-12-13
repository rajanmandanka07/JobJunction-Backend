// src/middlewares/validationMiddleware.js
const { check, validationResult } = require('express-validator');

const validateRegister = [
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('area').notEmpty().withMessage('Area is required'),
    check('role')
        .isIn(['user', 'tasker'])
        .withMessage('Role must be either user or tasker'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];

const validateLogin = [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];


module.exports = { validateRegister, validateLogin };
