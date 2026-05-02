const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Mark attendance (POST)
router.post('/mark', async (req, res) => {
  try {
    const { studentId, name, breakfast, lunch, dinner, dietaryPreferences } = req.body;

    console.log('📝 Mark attendance:', { studentId, name, breakfast, lunch, dinner, dietaryPreferences });

    if (!studentId || !breakfast || !lunch || !dinner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if student already marked attendance today
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      studentId: studentId,
      date: { $gte: start, $lte: end }
    });

    if (existingAttendance) {
      return res.status(400).json({ 
        error: 'You have already marked attendance today. You can mark again tomorrow.' 
      });
    }

    const attendance = new Attendance({
      studentId,
      name,
      breakfast,
      lunch,
      dinner,
      dietaryPreferences: dietaryPreferences || ''
    });

    await attendance.save();

    return res.json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (err) {
    console.error('Mark attendance error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get today's attendance summary (for admin)
router.get('/today-summary', async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).lean();

    let totals = {
      breakfast: { eating: 0, skipping: 0 },
      lunch: { eating: 0, skipping: 0 },
      dinner: { eating: 0, skipping: 0 }
    };

    records.forEach(r => {
      if (r.breakfast === 'eating') totals.breakfast.eating++;
      if (r.breakfast === 'skipping') totals.breakfast.skipping++;
      if (r.lunch === 'eating') totals.lunch.eating++;
      if (r.lunch === 'skipping') totals.lunch.skipping++;
      if (r.dinner === 'eating') totals.dinner.eating++;
      if (r.dinner === 'skipping') totals.dinner.skipping++;
    });

    return res.json({
      date: start.toISOString().slice(0, 10),
      totals,
      records
    });
  } catch (err) {
    console.error('Today summary error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;