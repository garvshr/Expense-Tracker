const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expense.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/expenses', expenseRoutes);

module.exports = app;


const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);