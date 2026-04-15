const express = require('express');
const router = express.Router();

const {
    createExpense,
    getExpenses, 
    getExpenseById,
    getTotalExpenses,
    updateExpense,
    deleteExpense,
    getCategorySummary,
    getMonthlySummary
} = require('../controllers/expense.controller');

const { validateExpense, validateExpenseUpdate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

// Apply protection to all routes below
router.use(protect);

// Create
router.post('/', validateExpense, createExpense);

// Read
router.get('/total', getTotalExpenses); 
router.get('/summary/category', getCategorySummary);
router.get('/summary/monthly', getMonthlySummary);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);

// Update
router.put('/:id', validateExpenseUpdate, updateExpense);

// Delete
router.delete('/:id', deleteExpense);

module.exports = router;