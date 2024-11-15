const express = require('express');
const {
    getAllFooters,
    getFooterById,
    createFooter,
    updateFooter,
    deleteFooter,
    createListFooter,
    updateListFooter,
    deleteListFooter
} = require('../controllers/footer.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllFooters);
router.get('/:id', getFooterById);
router.post('/', authenticateToken,createFooter);
router.put('/:id', authenticateToken,updateFooter);
router.delete('/:id', authenticateToken,deleteFooter);
router.post('/list/:footerId', authenticateToken,createListFooter);
router.put('/list/:id', authenticateToken,updateListFooter);
router.delete('/list/:id', authenticateToken,deleteListFooter);

module.exports = router;
