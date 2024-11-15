const express = require('express');
const {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} = require('../controllers/news.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', authenticateToken,createNews);
router.put('/:id', authenticateToken,updateNews);
router.delete('/:id', authenticateToken,deleteNews);

module.exports = router;
