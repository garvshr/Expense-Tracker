const express = require('express');
const router = express.Router();

const {
    createExpense,
    getExpenses, 
    getExpenseById,
    updateExpense,
    deleteExpense
} = require('../controllers/expense.controller');

const { validateExpense } = require('../middleware/validate.middleware');

router.post('/', validateExpense, createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', validateExpense, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;