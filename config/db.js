const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if connection string exists
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.log(`❌ MongoDB Connection Failed!`);
        console.log(`   Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
