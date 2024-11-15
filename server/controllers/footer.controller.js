const Footer = require('../models/Footer');
const ListContentFooter = require('../models/ListContentFooter');

exports.getAllFooters = async (req, res) => {
    try {
        const footers = await Footer.findAll({ include: ListContentFooter });
        if(footers.length === 0) return res.status(404).json({status: 404, msg: "Footer data is null"})
        res.status(200).json({status: 200, result: footers});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFooterById = async (req, res) => {
    try {
        const footer = await Footer.findByPk(req.params.id, { include: ListContentFooter });
        if (!footer) return res.status(404).json({ message: 'Footer not found' });
        res.status(200).json({status: 200, result: footer});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFooter = async (req, res) => {
    const { titleFooter } = req.body;

    try {
        if (!titleFooter) return res.status(400).json({status: 400, msg: "title data footer cannot be null"})
        const newFooter = await Footer.create({titleFooter});
        res.status(201).json({status: 201, data: newFooter, msg: 'data footer added successfully!'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createListFooter = async (req, res) => {
    const { content, urlLink } = req.body;
    const { footerId } = req.params;
    
    try {
        const footer = await Footer.findOne({where: {id: footerId}});
        if(!footer) return res.status(404).json({status: 404, msg: "data footer is not defined!"})

        const listFooter = await ListContentFooter.create({content, urlLink, footerId: footer['id']})
        res.status(201).json({status: 201, data: listFooter, msg: 'data list footer added successfully!'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateFooter = async (req, res) => {
    const { titleFooter } = req.body;

    try {
        const [updated] = await Footer.update({titleFooter}, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ message: 'Footer not found' });
        res.status(200).json({ status: 200, msg: 'Footer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateListFooter = async (req, res) => {
    const { content, urlLink } = req.body;
    const { id } = req.params;

    try {
        const [updated] = await ListContentFooter.update({content, urlLink}, { where: { id } });
        if (!updated) return res.status(404).json({ message: 'Footer not found' });
        res.status(200).json({ status: 200, msg: 'List Content Footer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteFooter = async (req, res) => {
    try {
        const deleted = await Footer.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Footer not found' });
        res.json({ message: 'Footer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteListFooter = async (req, res) => {
    const {id} = req.params;

    try {
        const deleted = await ListContentFooter.destroy({ where: {id} });
        if (!deleted) return res.status(404).json({ message: 'List Footer not found' });
        res.status(200).json({ status: 200, msg: 'List Footer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
