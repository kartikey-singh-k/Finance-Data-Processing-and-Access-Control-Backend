// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { AuthenticationError, AuthorizationError } = require('../utils/customErrors');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new AuthenticationError('Access token required');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            throw new AuthenticationError('Invalid or expired token');
        }
        req.user = user;
        next();
    });
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AuthorizationError('You do not have the required permissions for this action');
        }
        next();
    };
};

module.exports = { authenticateToken, requireRole };