const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware.authenticateToken, authController.profile);
router.post('/logout', authController.logout);

module.exports = router;
