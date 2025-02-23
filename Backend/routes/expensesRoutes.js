const express = require('express');
const router = express.Router();
const { addExpense } = require('../controllers/expenseController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, addExpense);

module.exports = router;
