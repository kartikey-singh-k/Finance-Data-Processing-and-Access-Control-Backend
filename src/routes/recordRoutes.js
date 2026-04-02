const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

router.use(authenticateToken); // Protect all record routes

router.get('/', requireRole(['Viewer', 'Analyst', 'Admin']), recordController.getRecords);
router.post('/', requireRole(['Admin']), recordController.createRecord);
router.put('/:id', requireRole(['Admin']), recordController.updateRecord);
router.delete('/:id', requireRole(['Admin']), recordController.deleteRecord);

module.exports = router;