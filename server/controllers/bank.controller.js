const { Op } = require('sequelize');
const Bank = require('../models/Bank');

exports.getAllBanks = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const { rows: banks, count } = await Bank.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        
        res.status(200).json({
            status: 200,
            result: banks,
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

exports.searchBankByAccount = async (req, res) => {
    const { norek = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows: banks, count } = await Bank.findAndCountAll({
            where: {
                [Op.or]: [
                    { account: { [Op.like]: `%${norek}%` } },
                    { bankName: { [Op.like]: `%${norek}%` } },
                    { branchBank: { [Op.like]: `%${norek}%` } }
                ]
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        if (banks.length === 0) return res.status(404).json({ status: 404, msg: "No matching bank accounts found" });

        res.status(200).json({
            status: 200,
            result: banks,
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



exports.getBankById = async (req, res) => {
    try {
        const bank = await Bank.findByPk(req.params.id);
        if (!bank) return res.status(404).json({ status: 404, msg: 'Bank not found' });
        res.status(200).json({status: 200, result: bank}); 
    } catch (error) { 
        res.status(500).json({ error: error.message });
    }
};

exports.createBank = async (req, res) => {
    const { bankName, branchBank, account } = req.body;

    try {
        if (!bankName && !branchBank && !account) {
            return res.status(400).json({status: 400, msg: "data bank name, branch bank and no account cannot be null!"})
        }
        const newBank = await Bank.create({bankName, branchBank, account});
        res.status(201).json({status: 201, data: newBank, msg: "data bank added successfully!"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBank = async (req, res) => {
    const { bankName, branchBank, account } = req.body;

    try {
        const [updated] = await Bank.update({ bankName, branchBank, account }, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ message: 'Bank not found' });
        res.status(200).json({ status: 200, data:updated, msg: 'Bank updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBank = async (req, res) => {
    try {
        const deleted = await Bank.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Bank not found' });
        res.status(200).json({ status: 200, message: 'Bank deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
