const Struct = require('../models/Struct');
const path = require('path');
const fs = require('fs');

exports.getAllStructs = async (req, res) => {
    try {
        const structs = await Struct.findAll();
        if(structs.length === 0) return res.status(404).json({status: 404, msg: "Struct data is null"})
        res.status(200).json({ status: 200, result: structs});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStructById = async (req, res) => {
    try {
        const struct = await Struct.findByPk(req.params.id);
        if (!struct) return res.status(404).json({ message: 'Struct not found' });
        res.status(200).json({ status: 200, result: struct});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStruct = async (req, res) => {
    try {
        const existingStruct = await Struct.findOne();
        if (existingStruct) {
            return res.status(400).json({ message: 'Only one struct record is allowed. Please update the existing struct.' });
        }

        if (!req.files || !req.files.imgStruct) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const imgStruct = req.files.imgStruct;

        const allowedExtensions = /png|jpeg|jpg/;
        const extName = path.extname(imgStruct.name).toLowerCase();
        if (!allowedExtensions.test(extName)) {
            return res.status(400).json({ message: 'Invalid file type. Only png, jpeg, and jpg are allowed.' });
        }

        const uploadPath = path.join(__dirname, '../uploads/struct', imgStruct.name);

        imgStruct.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ message: 'File upload failed', error: err.message });

            const newStruct = await Struct.create({
                imgStruct: `/uploads/struct/${imgStruct.name}`
            });

            res.status(201).json({ message: 'Struct created successfully', data: newStruct });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStruct = async (req, res) => {
    try {
        const struct = await Struct.findOne();
        if (!struct) return res.status(404).json({ message: 'Struct not found' });

        if (req.files && req.files.imgStruct) {
            const imgStruct = req.files.imgStruct;

            const allowedExtensions = /png|jpeg|jpg/;
            const extName = path.extname(imgStruct.name).toLowerCase();
            if (!allowedExtensions.test(extName)) {
                return res.status(400).json({ message: 'Invalid file type. Only png, jpeg, and jpg are allowed.' });
            }

            const oldImagePath = path.join(__dirname, '..', struct.imgStruct);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            const uploadPath = path.join(__dirname, '../uploads/struct', imgStruct.name);
            imgStruct.mv(uploadPath, async (err) => {
                if (err) return res.status(500).json({ message: 'File upload failed', error: err.message });

                await struct.update({
                    imgStruct: `/uploads/struct/${imgStruct.name}`
                });

                res.json({ message: 'Struct updated successfully', data: struct });
            });
        } else {
            res.status(400).json({ message: 'No image file uploaded for update' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStruct = async (req, res) => {
    try {
        const struct = await Struct.findByPk(req.params.id);
        if (!struct) return res.status(404).json({ message: 'Struct not found' });

        const imagePath = path.join(__dirname, '..', struct.imgStruct);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await struct.destroy();
        res.json({ message: 'Struct deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
