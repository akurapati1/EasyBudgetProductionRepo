const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(409).json({ message: 'Username already taken.' });
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                income: user.income,
                expenses: user.expenses,
                savingsGoals: user.savingsGoals
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in.' });
    }
};

exports.addIncome = async (req, res) => {
    const { date, amount, description, frequency } = req.body;
    if (!date || !amount || !description || !frequency) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        user.income.push({ date, amount, description, frequency });
        await user.save();
        const added = user.income[user.income.length - 1];
        res.status(201).json(added);
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: 'Error adding income.' });
    }
};

exports.addExpense = async (req, res) => {
    const { date, amount, description, frequency } = req.body;
    if (!date || !amount || !description || !frequency) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        user.expenses.push({ date, amount, description, frequency });
        await user.save();
        const added = user.expenses[user.expenses.length - 1];
        res.status(201).json(added);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Error adding expense.' });
    }
};

exports.addSavingsGoal = async (req, res) => {
    const { goalName, goalAmount, allocatedPercentage } = req.body;
    if (!goalName || !goalAmount || !allocatedPercentage) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        user.savingsGoals.push({ goalName, goalAmount, allocatedPercentage });
        await user.save();
        const added = user.savingsGoals[user.savingsGoals.length - 1];
        res.status(201).json(added);
    } catch (error) {
        console.error('Error adding savings goal:', error);
        res.status(500).json({ message: 'Error adding savings goal.' });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        user.income = user.income.filter(item => item._id.toString() !== req.params.id);
        await user.save();
        res.json({ message: 'Income deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting income.' });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        user.expenses = user.expenses.filter(item => item._id.toString() !== req.params.id);
        await user.save();
        res.json({ message: 'Expense deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense.' });
    }
};

exports.deleteSavingsGoal = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        user.savingsGoals = user.savingsGoals.filter(item => item._id.toString() !== req.params.id);
        await user.save();
        res.json({ message: 'Savings goal deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting savings goal.' });
    }
};
