const express = require('express');
const { getAllTermins, getTerminById, createTermin, updateTermin, deleteTermin } = require('../controllers/termin.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken,getAllTermins);
router.get('/:id',authenticateToken, getTerminById);
router.post('/', authenticateToken,createTermin);
router.put('/:id', authenticateToken,updateTermin);
router.delete('/:id', authenticateToken,deleteTermin);

module.exports = router;
