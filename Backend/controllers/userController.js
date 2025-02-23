const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log("In the UserController JS, User registered: ",newUser);
        res.status(201).json({ message: 'User registered', user: newUser });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
};
// Login a user
exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log("the backend logged function was hit, in user is : ", req.body);
    try {
        const user = await User.findOne({ username });
        console.log("The user in login function is : ",user);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
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
            console.log("The user details after login is : ", user);
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }

};


// Add income to user
exports.addIncome = async (req, res) => {
    const { date, amount,description, frequency} = req.body;
    console.log("In UserController JS Received income data:", req.body);
    try {
        const user = await User.findById(req.user.id);
        console.log("in Controller class, adding Income, the user is : ",user);
        if (!user.income) {
            user.income = []; // Initialize income array if it doesn't exist
        }
        user.income.push({date, amount, description, frequency});
        await user.save();
        res.status(200).send('Income added');
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).send('Error adding income');
    }
};

// Add expense to user
exports.addExpense = async (req, res) => {
    const {date, amount,description, frequency} = req.body;
    console.log("In UserController JS Received expense data:", req.body);
    try {
        const user = await User.findById(req.user.id);
        if (!user.expenses) {
            user.expenses = []; // Initialize expenses array if it doesn't exist
        }
        user.expenses.push({date, amount, description, frequency });
        await user.save();
        res.status(200).send('Expense added');
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).send('Error adding expense');
    }
};

exports.addSavingsGoal = async (req, res) => {
    const {goalName, goalAmount, allocatedPercentage} = req.body;
    console.log("In UserController JS Received saving goal data:", req.body);
    try {
        const user = await User.findById(req.user.id);
        if (!user.savingsGoals) {
            user.savingsGoals = []; // Initialize expenses array if it doesn't exist
        }
        user.savingsGoals.push({goalName, goalAmount, allocatedPercentage});
        await user.save();
        res.status(200).send('Expense added');
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).send('Error adding expense');
    }
};
