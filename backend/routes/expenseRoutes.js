const express = require('express');
const router = express.Router();

const {
    createExpense,
    getExpenses, 
    updateExpense
} = require('../controllers/expenseController');

router.post('/', createExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);

module.exports = router;