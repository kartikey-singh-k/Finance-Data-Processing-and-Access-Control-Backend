const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

router.get('/summary', authenticateToken, requireRole(['Analyst', 'Admin']), dashboardController.getSummary);

module.exports = router;