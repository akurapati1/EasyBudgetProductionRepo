const express = require('express');
const router = express.Router();
const { addIncome } = require('../controllers/incomeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, addIncome);

module.exports = router;
