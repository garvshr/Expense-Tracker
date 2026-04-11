const validateExpense = (req, res, next) => {
    let { title, amount, category } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Title is required and should be a valid string" });
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Amount must be a number greater than 0" });
    }

    const allowedCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

    if (!category || !allowedCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid or missing category" });
    }

    req.body.amount = amount;

    next();
};

const validateExpenseUpdate = (req, res, next) => {
    let { title, amount, category } = req.body;

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: "Title should be a valid string" });
        }
    }

    if (amount !== undefined) {
        amount = Number(amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Amount must be a number greater than 0" });
        }
        req.body.amount = amount;
    }

    const allowedCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];
    if (category !== undefined) {
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category" });
        }
    }

    next();
};

module.exports = {
    validateExpense,
    validateExpenseUpdate
};
