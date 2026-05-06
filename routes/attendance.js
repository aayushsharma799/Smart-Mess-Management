const express = require('express');
const router = express.Router();

// In-memory data store for attendance
let attendanceRecords = [];

// Mark attendance (POST)
router.post('/mark', async (req, res) => {
  try {
    const { studentId, name, breakfast, lunch, dinner, dietaryPreferences } = req.body;

    if (!studentId || !breakfast || !lunch || !dinner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    // Check if student already marked attendance today
    const existing = attendanceRecords.find(r => r.studentId === studentId && r.date === todayStr);

    if (existing) {
      return res.status(400).json({ 
        error: 'You have already marked attendance today. You can mark again tomorrow.' 
      });
    }

    const attendance = {
      studentId,
      name,
      breakfast,
      lunch,
      dinner,
      dietaryPreferences: dietaryPreferences || '',
      date: todayStr,
      timestamp: new Date().toISOString()
    };

    attendanceRecords.push(attendance);

    return res.json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get today's attendance summary (for admin)
router.get('/today-summary', async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    
    const records = attendanceRecords.filter(r => r.date === todayStr);

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
      date: todayStr,
      totals,
      records
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;