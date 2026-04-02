const { dbAll } = require('../db');

exports.getSummary = async (req, res, next) => {
    try {
        // Run aggregations concurrently
        const [incomeResult, expenseResult, categoryTotals, recentTransactions] = await Promise.all([
            dbAll(`SELECT SUM(amount) as total FROM records WHERE type = 'income'`),
            dbAll(`SELECT SUM(amount) as total FROM records WHERE type = 'expense'`),
            dbAll(`SELECT category, type, SUM(amount) as total, COUNT(*) as count FROM records GROUP BY category, type ORDER BY total DESC`),
            dbAll(`SELECT * FROM records ORDER BY date DESC LIMIT 10`)
        ]);

        const totalIncome = incomeResult[0].total || 0;
        const totalExpenses = expenseResult[0].total || 0;
        const netBalance = totalIncome - totalExpenses;

        res.json({
            success: true,
            data: {
                summary: {
                    totalIncome,
                    totalExpenses,
                    netBalance
                },
                categoryBreakdown: categoryTotals,
                recentTransactions
            }
        });
    } catch (error) {
        next(error);
    }
};