const express = require('express');
const cors = require('cors');
<<<<<<< feature/authentication
const cookieParser = require('cookie-parser');
const expenseRoutes = require('./routes/expense.routes');
const authRoutes = require('./routes/auth.routes');
=======
const expenseRoutes = require('./routes/expense.routes');
>>>>>>> dev

const app = express();

// Middlewares
<<<<<<< feature/authentication
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
=======
app.use(cors());
app.use(express.json());

// Routes

>>>>>>> dev
app.use('/api/expenses', expenseRoutes);

module.exports = app;


const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);