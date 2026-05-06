const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory data store for users
let users = [];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// ================== REGISTER ==================
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, studentId, password, role, adminCode } = req.body;

        // Check duplicate user
        const existingUser = users.find(u => u.email === email || (studentId && u.studentId === studentId));
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Determine user role
        let userRole = 'student';
        if (role === 'admin') {
            const ADMIN_CODE = process.env.ADMIN_CODE || 'ADMIN2025';
            if (!adminCode || adminCode !== ADMIN_CODE) {
                return res.status(403).json({ error: 'Invalid admin registration code' });
            }
            userRole = 'admin';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            _id: generateId(),
            name,
            email,
            phone: phone || undefined,
            studentId: studentId || undefined,
            password: hashedPassword,
            role: userRole
        };

        users.push(newUser);

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        return res.json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                studentId: newUser.studentId,
                role: newUser.role
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// ================== LOGIN ==================
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = users.find(u => u.email === email || u.studentId === email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (role && role !== user.role) {
            return res.status(401).json({ error: `This account is not registered as ${role}` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;