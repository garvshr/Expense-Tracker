const Expense = require('../models/expense');

const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createExpense,
    getExpenses
};