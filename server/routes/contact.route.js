const express = require('express');
const {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} = require('../controllers/contact.controller');
const {authenticateToken} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.post('/', authenticateToken,createContact);
router.put('/:id', authenticateToken,updateContact);
router.delete('/:id', authenticateToken,deleteContact);

module.exports = router;
