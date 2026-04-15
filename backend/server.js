const dotenv = require('dotenv');
const app = require('./src/app');
const connectDB = require('./src/config/db');

dotenv.config();

// Database is now handled by middleware in app.js

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;