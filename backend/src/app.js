const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expenseRoutes = require('./routes/expense.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection middleware
const connectDB = require('./config/db');
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
});

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

module.exports = app;


const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);