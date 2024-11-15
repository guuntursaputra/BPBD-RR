const User = require('../models/User');

exports.createAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ status: 400, message: "All fields are required" });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password: hashPassword });
        res.status(201).json({ status: 201, message: "Admin user added successfully", result: newUser });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

// Get all admins with pagination
exports.getAllAdmins = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { rows: admins, count } = await User.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        res.status(200).json({
            status: 200,
            result: admins,
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
