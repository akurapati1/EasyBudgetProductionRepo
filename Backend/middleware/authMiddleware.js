const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const jwtSecret = process.env.JWT_SECRET;  // Access from environment variables
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = authMiddleware;
