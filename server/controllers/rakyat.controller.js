const { Op } = require('sequelize');
const Bank = require('../models/Bank');
const Rakyat = require('../models/Rakyat');

exports.getAllRakyats = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { rows: rakyats, count } = await Rakyat.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [Bank],
        });
        res.status(200).json({
            status: 200,
            result: rakyats,
            pageInfo: {
                totalResults: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecapByNIK = async (req, res) => {
    const { NIK, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows: rakyats, count } = await Rakyat.findAndCountAll({
            where: {
                NIK: { [Op.like]: `%${NIK}%` },
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [Bank],
        });

        if (rakyats.length === 0) {
            return res.status(404).json({ status: 404, message: 'No matching records found.' });
        }

        res.status(200).json({
            status: 200,
            result: rakyats,
            pageInfo: {
                totalResults: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getRakyatById = async (req, res) => {
    try {
        const rakyat = await Rakyat.findByPk(req.params.id, { include: Bank });
        if (!rakyat) return res.status(404).json({ message: 'Rakyat not found' });
        res.status(200).json({ status: 200, result: rakyat });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRakyat = async (req, res) => {
    const { name, NIK, gender, bankId } = req.body;

    try {
        const bank = await Bank.findOne({ where: { id: bankId } });

        if (!bank) return res.status(404).json({ status: 404, msg: "Bank not found" });
        if (NIK.length !== 16) return res.status(400).json({ status: 400, msg: "NIK must be 16 characters" });

        const newRakyat = await Rakyat.create({ name, NIK, gender, bankId });

        res.status(201).json({ status: 201, data: newRakyat, msg: "Rakyat created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRakyat = async (req, res) => {
    const { name, NIK, gender, bankId } = req.body;

    try {
        const bank = await Bank.findOne({ where: { id: bankId } });

        if (!bank) return res.status(404).json({ status: 404, msg: "Bank not found" });
        if (NIK.length !== 16) return res.status(400).json({ status: 400, msg: "NIK must be 16 characters" });

        const [updated] = await Rakyat.update(
            { name, NIK, gender, bankId },
            { where: { id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ status: 404, message: 'Rakyat not found' });

        res.status(200).json({ status: 200, message: 'Rakyat updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRakyat = async (req, res) => {
    try {
        const deleted = await Rakyat.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Rakyat not found' });
        res.status(200).json({ status: 200, message: 'Rakyat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
