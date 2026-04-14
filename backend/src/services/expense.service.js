const Expense = require('../models/expense.model');

exports.getExpenses = async (query) => {
    const { page = 1, limit = 100, category, min, max, sort = 'date_desc' } = query;

    let filter = {};

    if (category) {
        filter.category = category;
    }

    let amountFilter = {};

    if (min !== undefined && min !== '') {
        const minVal = Number(min);

        if (isNaN(minVal)) {
            const err = new Error("min must be a number");
            err.status = 400;
            throw err;
        }

        amountFilter.$gte = minVal;
    }

    if (max !== undefined && max !== '') {
        const maxVal = Number(max);

        if (isNaN(maxVal)) {
            const err = new Error("max must be a number");
            err.status = 400;
            throw err;
        }

        amountFilter.$lte = maxVal;
    }

    if (Object.keys(amountFilter).length > 0) {
        filter.amount = amountFilter;
    }

    let sortOption = {};
    if (sort === 'amount_asc') sortOption.amount = 1;
    if (sort === 'amount_desc') sortOption.amount = -1;
    if (sort === 'date_desc') sortOption.date = -1;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const safePage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const safeLimit = !isNaN(limitNum) && limitNum > 0 ? limitNum : 10;

    const expenses = await Expense.find(filter)
        .sort(sortOption)
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit);

    const total = await Expense.countDocuments(filter);

    return {
        total,
        page: safePage,
        limit: safeLimit,
        data: expenses
    };
};

exports.categorySummary = async () => {
    return await Expense.aggregate([
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        }
    ]);
};

exports.monthlySummary = async () => {
    return await Expense.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                total: { $sum: "$amount" }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ]);
};

exports.getTotalExpenses = async () => {
    const result = await Expense.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]);

    return result.length > 0 ? result[0].total : 0;
};

exports.createExpense = async (expenseData) => {
    const expense = new Expense(expenseData);
    return expense.save();
};

exports.getExpenseById = async (id) => {
    return await Expense.findById(id);
};

exports.updateExpense = async (id, updateData) => {
    return await Expense.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteExpense = async (id) => {
    return await Expense.findByIdAndDelete(id);
};