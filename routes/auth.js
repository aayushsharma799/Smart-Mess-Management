const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ================== REGISTER ==================
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, studentId, password } = req.body;

    console.log('🟢 REGISTER body:', req.body);

    // Check duplicate user
    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // DO NOT hash here; model pre-save hook will hash
    const user = new User({
      name,
      email,
      phone,
      studentId,
      password        // raw password; User.js will hash before save
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
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
    console.error('❌ Register error:', err);
    return res.status(400).json({ error: err.message });
  }
});

// ================== LOGIN ==================
router.post('/login', async (req, res) => {
  try {
    console.log('📩 Login body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find by email OR studentId (student can type ID in email field)
    const user = await User.findOne({
      $or: [
        { email: email },
        { studentId: email }
      ]
    });

    if (!user) {
      console.log('❌ User not found for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('🔐 Comparing password for user:', user.email);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('Password valid?', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
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
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ================== GOOGLE OAUTH ==================
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          verified: true
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&userId=${req.user._id}`);
  }
);

module.exports = router;