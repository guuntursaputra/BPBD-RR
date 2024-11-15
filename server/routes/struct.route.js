const express = require('express');
const {
    getAllStructs,
    getStructById,
    createStruct,
    updateStruct,
    deleteStruct
} = require('../controllers/struct.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllStructs);
router.get('/:id', getStructById);
router.post('/', authenticateToken, createStruct);
router.put('/:id', authenticateToken, updateStruct);
router.delete('/:id', authenticateToken, deleteStruct);

module.exports = router;
