const express = require('express');
const User = require('../models/User'); // Make sure the path to the User model is correct
const router = express.Router();

router.post('/budget/income', async (req, res) => {
    const { userId, date, amount, description, frequency } = req.body;
    console.log('In BudgetRouting JS , Received data for adding income:', req.body); // Log the received data
    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log('In Budjet Routes, User found:', user); // Log the user data
        if (!user.income) {
            user.income = []; // Initialize the income array if it doesn't exist
        }
        const newIncome = { date, amount, description, frequency };
        user.income.push(newIncome);
        await user.save();
        console.log("Data pushed to DB");
        res.status(201).send(user);
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).send('Error adding income');
    }
});

router.post('/budget/expense', async (req, res) => {
    const { userId, date, amount, description, frequency } = req.body;
    console.log('In BudgetRouting JS , Received data for adding expense:', req.body); // Log the received data
    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log('User found:', user); // Log the user data
        if (!user.expenses) {
            user.expenses = []; // Initialize the expenses array if it doesn't exist
        }
        user.expenses.push({ date, amount , description, frequency });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).send('Error adding expense');
    }


});

router.post('/budget/saving', async (req, res) => {
    const { userId, goalName, goalAmount, allocatedPercentage } = req.body;
    console.log('In BudgetRouting JS , Received data for adding Savings Goal:', req.body); // Log the received data
    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log('User found:', user); // Log the user data
        if (!user.savingsGoals) {
            user.savingsGoals = []; // Initialize the expenses array if it doesn't exist
        }
        user.savingsGoals.push({ goalName, goalAmount, allocatedPercentage });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).send('Error adding goal');
    }
});

module.exports = router;
