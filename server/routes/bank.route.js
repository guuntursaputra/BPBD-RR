const express = require('express');
const { getAllBanks, getBankById, createBank, updateBank, deleteBank, searchBankByAccount } = require('../controllers/bank.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/search', authenticateToken,searchBankByAccount);  // Move this line above the `/:id` route
router.get('/', authenticateToken,getAllBanks);
router.get('/:id', authenticateToken,getBankById);
router.put('/:id', authenticateToken,updateBank);
router.post('/', authenticateToken,createBank);
router.delete('/:id', authenticateToken,deleteBank);

module.exports = router;
