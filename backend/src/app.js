const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expenseRoutes = require('./routes/expense.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

module.exports = app;


const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);