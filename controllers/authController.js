const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create new user
        user = new User({ name, email, password });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: { id: user.id, name: user.name, email: user.email }, token }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({success: false, message: err.message});
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user: { id: user.id, name: user.name, email: user.email }, token }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Validate Token
exports.validateToken = (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ success: true, message: 'Token is valid', data: decoded });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    }
};
