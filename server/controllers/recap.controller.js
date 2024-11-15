const Recap = require('../models/Recap');
const Rakyat = require('../models/Rakyat');
const Termin = require('../models/Termin');
const TerminNominal = require('../models/TerminNominal');
const Bank = require('../models/Bank');
const { Op } = require('sequelize');


exports.getAllRecaps = async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    try {
        const whereCondition = {
            [Op.or]: [
                { NIK: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
            ]
        };

        const { rows: recaps, count } = await Recap.findAndCountAll({
            include: [
                {
                    model: Rakyat,
                    where: whereCondition,
                    include: [
                        {
                            model: Bank,
                        }
                    ]
                },
                {
                    model: Termin,
                },
                {
                    model: TerminNominal,
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        if (recaps.length === 0) return res.status(404).json({ status: 404, message: "No Recap data found" });

        res.status(200).json({
            status: 200,
            result: recaps,
            pageInfo: {
                totalResults: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};


exports.getAllRecapsVisitor = async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    if (search.length < 3) {
        return res.status(400).json({ status: 400, message: "Search term must be at least 3 characters long." });
    }

    try {
        console.log(`Fetching recaps with search: "${search}"`);

        const { rows: recaps, count } = await Recap.findAndCountAll({
            include: [
                {
                    model: Rakyat,
                    where: { name: { [Op.like]: `%${search}%` } },
                    include: [{ model: Bank }]
                },
                { model: Termin },
                { model: TerminNominal }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        if (recaps.length === 0) {
            console.log("No recaps found for the provided search criteria.");
            return res.status(404).json({ status: 404, message: "No Recap data found" });
        }

        // Convert Sequelize instances to plain objects and mask NIK
        const formattedRecaps = recaps.map(recap => {
            const recapData = recap.toJSON();
            const rakyat = recapData.Rakyat;
            recapData.Rakyat.NIK = rakyat.NIK.slice(0, 4) + "xxxxx" + rakyat.NIK.slice(-2); // Mask NIK
            return recapData;
        });

        res.status(200).json({
            status: 200,
            result: formattedRecaps,
            pageInfo: {
                totalResults: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
            }
        });
    } catch (error) {
        console.error("Error fetching recaps:", error.message);
        res.status(500).json({ status: 500, error: error.message });
    }
};


exports.getTerminNominalHistoryByRecapIdVisitor = async (req, res) => {
    try {
        const recapId = req.params.recapId;
        const terminNominalHistory = await TerminNominal.findAll({
            where: { recapId },
            include: [Termin]
        });

        if (terminNominalHistory.length === 0) {
            return res.status(404).json({ status: 404, message: 'No history found for this Recap ID' });
        }

        res.status(200).json({ status: 200, result: terminNominalHistory });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getRecapById = async (req, res) => {
    try {
        const recap = await Recap.findOne({
            where: {id: req.params.id},
            include: [
                {
                    model: Rakyat,
                    include: [Bank]
                },
                Termin,
                TerminNominal,
            ]
        });
        if (!recap) return res.status(404).json({ status: 404, message: 'Recap not found' });
        res.status(200).json({ status: 200, result: recap });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

// Create Recap and initial TerminNominal
exports.createRecap = async (req, res) => {
    const { rakyatId, terminId, lvlDamage, transactionDate, stage, nominal } = req.body;

    if (!rakyatId || !terminId || !lvlDamage) {
        return res.status(400).json({ status: 400, message: 'rakyatId, terminId, and lvlDamage are required' });
    }

    try {
        const rakyat = await Rakyat.findByPk(rakyatId);
        if (!rakyat) {
            return res.status(404).json({ status: 404, message: 'Rakyat not found' });
        }

        const termin = await Termin.findByPk(terminId);
        if (!termin) {
            return res.status(404).json({ status: 404, message: 'Termin not found' });
        }

        const newRecap = await Recap.create({ rakyatId, terminId, lvlDamage, transactionDate });

        // Create initial TerminNominal entry
        const nominalTermin = await TerminNominal.create({
            stage,
            nominal,
            terminId: termin.id,
            recapId: newRecap.id
        });

        res.status(201).json({
            status: 201,
            message: 'Recap and related TerminNominal created successfully',
            result: {
                recap: newRecap,
                terminNominal: nominalTermin
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.updateRecap = async (req, res) => {
    const { rakyatId, terminId, lvlDamage, transactionDate, stage, nominal } = req.body;

    try {
        const recap = await Recap.findByPk(req.params.id);
        if (!recap) {
            return res.status(404).json({ status: 404, message: 'Recap not found' });
        }

        if (rakyatId) {
            const rakyat = await Rakyat.findByPk(rakyatId);
            if (!rakyat) {
                return res.status(404).json({ status: 404, message: 'Rakyat not found' });
            }
        }

        // Check if terminId changes, and verify if the new terminNum is valid
        let newTerminNominal;
        if (terminId && recap.terminId !== terminId) {
            const newTermin = await Termin.findByPk(terminId);
            const currentTermin = await Termin.findByPk(recap.terminId);

            if (!newTermin) {
                return res.status(404).json({ status: 404, message: 'Termin not found' });
            }
            
            if (newTermin.terminNum < currentTermin.terminNum) {
                return res.status(400).json({ status: 400, message: 'Termin cannot move backwards' });
            }

            newTerminNominal = await TerminNominal.create({
                recapId: recap.id,
                terminId: newTermin.id,
                stage: stage || 1, 
                nominal: nominal || '0', 
            });

            await recap.update({ rakyatId, terminId, lvlDamage, transactionDate });
        } else if (nominal !== undefined) {
            newTerminNominal = await TerminNominal.create({
                recapId: recap.id,
                terminId: recap.terminId,
                stage: stage || 1,
                nominal: nominal,
            });

            await recap.update({ rakyatId, lvlDamage, transactionDate });
        } else {
            await recap.update({ rakyatId, lvlDamage, transactionDate });
        }

        res.status(200).json({
            status: 200,
            message: 'Recap updated successfully with new TerminNominal tracking if applicable',
            result: recap,
            newTerminNominal: newTerminNominal || null
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.getTerminNominalHistoryByRecapId = async (req, res) => {
    try {
        const recapId = req.params.recapId;
        const terminNominalHistory = await TerminNominal.findAll({
            where: { recapId },
            include: [Termin]
        });

        if (terminNominalHistory.length === 0) {
            return res.status(404).json({ status: 404, message: 'No history found for this Recap ID' });
        }

        res.status(200).json({ status: 200, result: terminNominalHistory });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

exports.deleteRecap = async (req, res) => {
    try {
        const recap = await Recap.findByPk(req.params.id);
        if (!recap) return res.status(404).json({ status: 404, message: 'Recap not found' });

        await TerminNominal.destroy({ where: { recapId: recap.id } });

        await recap.destroy();
        res.status(200).json({ status: 200, message: 'Recap and associated TerminNominal deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};
