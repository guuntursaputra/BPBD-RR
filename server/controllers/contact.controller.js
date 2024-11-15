const Contact = require('../models/Contact');

// Helper function to check if the embed URL is a valid Google Maps embed link
function isValidGoogleMapsEmbed(url) {
    const regex = /^https:\/\/www\.google\.com\/maps\/embed\?.+/;
    return regex.test(url);
}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        if (contacts.length === 0) return res.status(404).json({ status: 404, msg: "Contact data is null" });
        res.status(200).json({ status: 200, result: contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ status: 404, message: 'Contact not found' });
        res.status(200).json({ status: 200, result: contact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create Contact (Only one record allowed)
exports.createContact = async (req, res) => {
    const { detailLocation, embedMap } = req.body;

    // Check if embedMap is a valid Google Maps embed link
    if (!isValidGoogleMapsEmbed(embedMap)) {
        return res.status(400).json({ message: 'Invalid embed URL. Only Google Maps embed URLs are allowed.' });
    }

    try {
        // Check if there is already a contact record
        const existingContact = await Contact.findOne();
        if (existingContact) {
            return res.status(400).json({ message: 'Only one contact record is allowed. Please update the existing contact.' });
        }

        // Create a new contact record
        const newContact = await Contact.create({ detailLocation, embedMap });
        res.status(201).json({ status: 200, result: newContact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Contact
exports.updateContact = async (req, res) => {
    const { detailLocation, embedMap } = req.body;

    // Check if embedMap is a valid Google Maps embed link
    if (embedMap && !isValidGoogleMapsEmbed(embedMap)) {
        return res.status(400).json({ message: 'Invalid embed URL. Only Google Maps embed URLs are allowed.' });
    }

    try {
        const [updated] = await Contact.update(
            { detailLocation, embedMap },
            { where: { id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json({ status: 200, message: 'Contact updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Contact
exports.deleteContact = async (req, res) => {
    try {
        const deleted = await Contact.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json({ status: 200, message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
