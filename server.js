const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
