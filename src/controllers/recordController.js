const { dbRun, dbGet, dbAll } = require('../db');
const { ValidationError, NotFoundError } = require('../utils/customErrors');

exports.createRecord = async (req, res, next) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        
        // Input Validation
        if (!amount || !type || !category || !date) {
            throw new ValidationError('Amount, type, category, and date are required');
        }
        if (type !== 'income' && type !== 'expense') {
            throw new ValidationError("Type must be 'income' or 'expense'");
        }
        if (amount <= 0) {
            throw new ValidationError('Amount must be a positive number');
        }

        const result = await dbRun(
            `INSERT INTO records (amount, type, category, date, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
            [amount, type, category, date, notes || '', req.user.id]
        );

        res.status(201).json({ 
            success: true,
            data: {
                id: result.lastID,
                amount,
                type,
                category,
                date,
                notes
            },
            message: 'Record created successfully' 
        });
    } catch (error) {
        next(error);
    }
};

exports.getRecords = async (req, res, next) => {
    try {
        const { type, category, page = 1, limit = 50 } = req.query;
        
        const offset = (page - 1) * limit;
        
        let query = `SELECT * FROM records WHERE 1=1`;
        const params = [];

        if (type) {
            query += ` AND type = ?`;
            params.push(type);
        }
        if (category) {
            query += ` AND category = ?`;
            params.push(category);
        }

        // Get total count
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const countResult = await dbGet(countQuery, params);
        const total = countResult.total;

        // Add pagination
        query += ` ORDER BY date DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const records = await dbAll(query, params);
        
        res.json({
            success: true,
            data: records,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, type, category, date, notes } = req.body;

        const record = await dbGet(`SELECT * FROM records WHERE id = ?`, [id]);
        if (!record) {
            throw new NotFoundError('Record');
        }

        if (amount !== undefined && amount <= 0) {
            throw new ValidationError('Amount must be a positive number');
        }

        if (type && type !== 'income' && type !== 'expense') {
            throw new ValidationError("Type must be 'income' or 'expense'");
        }

        await dbRun(
            `UPDATE records SET amount = ?, type = ?, category = ?, date = ?, notes = ? WHERE id = ?`,
            [
                amount !== undefined ? amount : record.amount,
                type || record.type,
                category || record.category,
                date || record.date,
                notes !== undefined ? notes : record.notes,
                id
            ]
        );

        res.json({ 
            success: true,
            message: 'Record updated successfully' 
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await dbRun(`DELETE FROM records WHERE id = ?`, [id]);
        
        if (result.changes === 0) {
            throw new NotFoundError('Record');
        }
        
        res.json({ 
            success: true,
            message: 'Record deleted successfully' 
        });
    } catch (error) {
        next(error);
    }
};