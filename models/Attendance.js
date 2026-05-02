const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: String,
  breakfast: { type: String, enum: ['eating', 'skipping'], required: true },
  lunch: { type: String, enum: ['eating', 'skipping'], required: true },
  dinner: { type: String, enum: ['eating', 'skipping'], required: true },
  dietaryPreferences: String,  // NEW FIELD
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);