const express = require('express');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Routes

app.use('/api/expenses', expenseRoutes);

module.exports = app;