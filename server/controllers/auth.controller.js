const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (username.length < 3 || username.length > 50) {
      return res.status(401).json({ status: 401, msg: 'Username must be between 3 and 50 characters' });
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ username, email, password: hashPassword });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    console.log({data: req.body})

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({status: 500, error: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
