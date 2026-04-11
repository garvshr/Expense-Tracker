const expenseService = require('../services/expense.service');

// CREATE
const createExpense = async (req, res, next) => {
    try {
        const expense = await expenseService.createExpense(req.body);
        res.status(201).json({ message: 'Expense created successfully', expense });
    } catch (err) {
        next(err);
    }
};

// GET ALL (with pagination/filter)
const getExpenses = async (req, res, next) => {
    try {
        const data = await expenseService.getExpenses(req.query);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

// GET BY ID
const getExpenseById = async (req, res, next) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json(expense);
    } catch (err) {
        next(err);
    }
};

// UPDATE
const updateExpense = async (req, res, next) => {
    try {
        const expense = await expenseService.updateExpense(req.params.id, req.body);

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: 'Updated successfully', expense });
    } catch (err) {
        next(err);
    }
};

// DELETE
const deleteExpense = async (req, res, next) => {
    try {
        const expense = await expenseService.deleteExpense(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// TOTAL
const getTotalExpenses = async (req, res, next) => {
    try {
        const total = await expenseService.getTotalExpenses();
        res.json({ total });
    } catch (err) {
        next(err);
    }
};

// CATEGORY SUMMARY
const getCategorySummary = async (req, res, next) => {
    try {
        const data = await expenseService.categorySummary();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

// MONTHLY SUMMARY
const getMonthlySummary = async (req, res, next) => {
    try {
        const data = await expenseService.monthlySummary();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
    getCategorySummary,
    getMonthlySummary
};