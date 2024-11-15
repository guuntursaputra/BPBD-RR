const express = require('express');
const {
    getAllAbout,
    getAboutById,
    createAbout,
    updateAbout,
    deleteAbout
} = require('../controllers/about.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllAbout);
router.get('/:id', getAboutById);
router.post('/', authenticateToken,createAbout);
router.put('/:id', authenticateToken,updateAbout);
router.delete('/:id', authenticateToken,deleteAbout);

module.exports = router;
