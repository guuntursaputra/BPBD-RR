const News = require('../models/News');
const path = require('path');
const fs = require('fs');

// Get All News
exports.getAllNews = async (req, res) => {
    try {
        const news = await News.findAll();
        if (news.length === 0) return res.status(404).json({ status: 404, msg: "News data is null" });
        res.status(200).json({ status: 200, result: news });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get News by ID
exports.getNewsById = async (req, res) => {
    try {
        const newsItem = await News.findByPk(req.params.id);
        if (!newsItem) return res.status(404).json({ message: 'News item not found' });
        res.status(200).json({ status: 200, result: newsItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create News with Image Upload
exports.createNews = async (req, res) => {
    try {
        const { titleNews, contentNews } = req.body;

        if (!req.files || !req.files.imgNews) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const imgNews = req.files.imgNews;

        const allowedExtensions = /png|jpeg|jpg/;
        const extName = path.extname(imgNews.name).toLowerCase();
        if (!allowedExtensions.test(extName)) {
            return res.status(400).json({ message: 'Invalid file type. Only png, jpeg, and jpg are allowed.' });
        }

        const uploadPath = path.join(__dirname, '../uploads/news', imgNews.name);

        imgNews.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ message: 'File upload failed', error: err.message });

            const newNews = await News.create({
                titleNews,
                contentNews,
                imgNewsUrl: `/uploads/news/${imgNews.name}`
            });

            res.status(201).json({ message: 'News created successfully', data: newNews });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update News with Image Update Support
exports.updateNews = async (req, res) => {
    try {
        const { titleNews, contentNews } = req.body;
        const newsItem = await News.findByPk(req.params.id);

        if (!newsItem) return res.status(404).json({ message: 'News item not found' });

        // Check if a new image is uploaded
        if (req.files && req.files.imgNews) {
            const imgNews = req.files.imgNews;

            // Validate file type
            const allowedExtensions = /png|jpeg|jpg/;
            const extName = path.extname(imgNews.name).toLowerCase();
            if (!allowedExtensions.test(extName)) {
                return res.status(400).json({ message: 'Invalid file type. Only png, jpeg, and jpg are allowed.' });
            }

            // Delete the old image file
            const oldImagePath = path.join(__dirname, '..', newsItem.imgNewsUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Upload new image
            const uploadPath = path.join(__dirname, '../uploads/news', imgNews.name);
            imgNews.mv(uploadPath, async (err) => {
                if (err) return res.status(500).json({ message: 'File upload failed', error: err.message });

                // Update news record with new image URL
                await newsItem.update({
                    titleNews,
                    contentNews,
                    imgNewsUrl: `/uploads/news/${imgNews.name}`
                });

                res.json({ message: 'News updated successfully', data: newsItem });
            });
        } else {
            // Update only text fields if no new image is uploaded
            await newsItem.update({ titleNews, contentNews });
            res.json({ message: 'News updated successfully', data: newsItem });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete News with Image Deletion
exports.deleteNews = async (req, res) => {
    try {
        const newsItem = await News.findByPk(req.params.id);

        if (!newsItem) return res.status(404).json({ message: 'News item not found' });

        // Delete the image file associated with the news item
        const imagePath = path.join(__dirname, '..', newsItem.imgNewsUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Delete the news item from the database
        await newsItem.destroy();
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
