const express = require('express');
const { getAllRakyats, getRakyatById, createRakyat, updateRakyat, deleteRakyat, getRecapByNIK } = require('../controllers/rakyat.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/search', authenticateToken, getRecapByNIK);
router.get('/', authenticateToken, getAllRakyats);
router.get('/:id', authenticateToken,getRakyatById);
router.post('/', authenticateToken,createRakyat);
router.put('/:id', authenticateToken,updateRakyat);
router.delete('/:id', authenticateToken,deleteRakyat);

module.exports = router;
