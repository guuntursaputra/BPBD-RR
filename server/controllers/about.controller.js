const About = require('../models/About');

exports.getAllAbout = async (req, res) => {
    try {
        const abouts = await About.findAll();
        if (abouts.length === 0) {
            return res.status(404).json({ status: 404, message: "No About data found" });
        }
        res.status(200).json({ status: 200, result: abouts });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getAboutById = async (req, res) => {
    try {
        const about = await About.findByPk(req.params.id);
        if (!about) {
            return res.status(404).json({ status: 404, message: 'About record not found' });
        }
        res.status(200).json({ status: 200, result: about });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.createAbout = async (req, res) => {
    const { aboutUs, detailAboutUs } = req.body;

    try {
        // Check if there's already an About record
        const existingAbout = await About.findOne();
        if (existingAbout) {
            return res.status(400).json({ status: 400, message: 'Only one About record is allowed. Please update the existing record.' });
        }

        // Create new About record
        const newAbout = await About.create({ aboutUs, detailAboutUs });
        res.status(201).json({ status: 201, result: newAbout, message: 'About created successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.updateAbout = async (req, res) => {
    const { aboutUs, detailAboutUs } = req.body;

    try {
        // Find the About record by ID
        const about = await About.findByPk(req.params.id);
        if (!about) {
            return res.status(404).json({ status: 404, message: 'About record not found' });
        }

        // Update the About record
        await about.update({ aboutUs, detailAboutUs }, {where: {id: req.params.id}});
        res.status(200).json({ status: 200, result: about, message: 'About updated successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.deleteAbout = async (req, res) => {
    try {
        const about = await About.findByPk(req.params.id);
        if (!about) {
            return res.status(404).json({ status: 404, message: 'About record not found' });
        }

        // Delete the About record
        await about.destroy();
        res.status(200).json({ status: 200, message: 'About deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};
