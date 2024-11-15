const express = require('express');
const {
    getAllRecaps,
    getRecapById,
    createRecap,
    updateRecap,
    deleteRecap,
    getTerminNominalHistoryByRecapId,
    getAllRecapsVisitor,
    getTerminNominalHistoryByRecapIdVisitor
} = require('../controllers/recap.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();
router.get('/visitor', getAllRecapsVisitor);
router.get('/:recapId/history/visitor', getTerminNominalHistoryByRecapIdVisitor);
router.get('/', authenticateToken, getAllRecaps);
router.get('/:id', authenticateToken, getRecapById);
router.post('/', authenticateToken, createRecap);
router.put('/:id', authenticateToken, updateRecap);
router.delete('/:id', authenticateToken,deleteRecap);
router.get('/:recapId/history', authenticateToken, getTerminNominalHistoryByRecapId);

module.exports = router;
