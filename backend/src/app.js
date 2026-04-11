const express = require('express');
const expenseRoutes = require('./routes/expense.routes');

const app = express();

// Middlewares
app.use(express.json());

// Routes

app.use('/api/expenses', expenseRoutes);

module.exports = app;


const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);