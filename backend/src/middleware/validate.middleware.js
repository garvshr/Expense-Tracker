const validateExpense = (req, res, next) => {
    const { title, amount, category} = req.body;
    if(!title || typeof title !== 'string') 
        return res.status(400).json({ error: "Title is required and should be a string" });

    if(!amount || typeof amount !== 'number')
        return res.status(400).json({ error: "Amount is required and should be a number" });

    if(category && !['Food', 'Travel', 'Shopping', 'Bills', 'Other'].includes(category))
        return res.status(400).json({ error: "Invalid category" });
    next();
}; 

module.exports = {
    validateExpense
};