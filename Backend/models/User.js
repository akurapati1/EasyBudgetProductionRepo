const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({ // Schema for user
    username: { type: String, required: true },
    password: { type: String, required: true },
    income: [
        {
            date: { type: Date, required: true },
            amount: { type: Number, required: true },
            description: { type: String, required: true },
            frequency: { type: String, required: true }
        }
    ],
    expenses: [
        {
            date: { type: Date, required: true },
            amount: { type: Number, required: true },
            description: { type: String, required: true },
            frequency: { type: String, required: true }
        }
    ],
    savingsGoals: [
        {
            goalName: { type: String, required: true },
            goalAmount: { type: Number, required: true },
            allocatedPercentage: { type: Number, required: true }
        }
    ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
