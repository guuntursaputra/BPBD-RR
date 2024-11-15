const express = require('express');
const { createAdmin, getAllAdmins } = require('../controllers/admin.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create', authenticateToken, createAdmin);
router.get('/', authenticateToken, getAllAdmins); // Route for getting all admins with pagination

module.exports = router;
