const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register route
router.post('/register', authController.registerUser);

// Login route
router.post('/login', authController.loginUser);

// Validate token route
router.get('/validate-token', authMiddleware, authController.validateToken);

module.exports = router;
