const mongoose = require('mongoose');

// Cache the connection in serverless environment
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const url = process.env.MONGO_URI;
        
        if (!url) {
            console.error('[DB] Error: MONGO_URI is missing in environment variables!');
            throw new Error('Please define the MONGO_URI environment variable');
        }

        console.log('[DB] Connecting to MongoDB...');
        
        cached.promise = mongoose.connect(url, {
            bufferCommands: false, // Disable buffering for faster fail/success
        }).then((mongoose) => {
            console.log('[DB] Connected successfully!');
            return mongoose;
        }).catch((err) => {
            console.error('[DB] Connection error:', err.message);
            cached.promise = null; // Reset promise so we can retry
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = connectDB;