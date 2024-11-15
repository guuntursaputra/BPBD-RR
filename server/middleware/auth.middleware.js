const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({status: 403, msg: 'You must login!'});

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({status: 403, msg: 'You must login!'});
    req.user = user;
    next();
  });
};
