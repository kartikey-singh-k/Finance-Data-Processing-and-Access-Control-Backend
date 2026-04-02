const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbRun, dbGet } = require('../db');
const { AuthenticationError, ConflictError, ValidationError } = require('../utils/customErrors');

exports.register = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        
        if (!username || !password || !role) {
            throw new ValidationError('Username, password, and role are required');
        }

        const validRoles = ['Viewer', 'Analyst', 'Admin'];
        if (!validRoles.includes(role)) {
            throw new ValidationError('Invalid role. Must be Viewer, Analyst, or Admin');
        }

        // Check if user already exists
        const existingUser = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser) {
            throw new ConflictError('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await dbRun(
            `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            [username, hashedPassword, role]
        );
        
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully' 
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            throw new ValidationError('Username and password are required');
        }

        const user = await dbGet(`SELECT * FROM users WHERE username = ?`, [username]);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AuthenticationError('Invalid username or password');
        }

        if (user.status !== 'active') {
            throw new AuthenticationError('Account is inactive. Please contact support.');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};