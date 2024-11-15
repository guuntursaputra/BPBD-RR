const Termin = require('../models/Termin');
const TerminNominal = require('../models/TerminNominal');

exports.getAllTermins = async (req, res) => {
    try {
        const termins = await Termin.findAll({include: TerminNominal});
        if(termins.length === 0) return res.status(404).json({status: 404, msg: "Termin data is null"})
        res.status(200).json({status: 200, result: termins});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTerminById = async (req, res) => {
    try {
        const termin = await Termin.findByPk(req.params.id, {include: TerminNominal});
        if (!termin) return res.status(404).json({ message: 'Termin not found' });
        res.status(200).json({status: 200, result: termin});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTermin = async (req, res) => {
    const { terminNum, description } = req.body;

    try {
        const existingTermin = await Termin.findOne({ where: { terminNum } });
        if (existingTermin) {
            return res.status(400).json({ status: 400, msg: "Termin number already exists. Cannot add duplicate." });
        }

        const newTermin = await Termin.create({ terminNum, description });
        res.status(201).json({ status: 201, result: newTermin, msg: "Termin created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateTermin = async (req, res) => {
    const {terminNum, description} = req.body;
    try {
        const [updated] = await Termin.update({terminNum, description}, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ message: 'Termin not found' });
        res.status(200).json({ status: 200, message: 'Termin updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTermin = async (req, res) => {
    try {
        const deleted = await Termin.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Termin not found' });
        res.json({ message: 'Termin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
