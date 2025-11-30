
// backend/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');

// API lấy lịch của bệnh nhân (QUAN TRỌNG NHẤT)
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Lỗi server' });
  }
});

// API đặt lịch (nếu bạn cần)
router.post('/', protect, async (req, res) => {
  try {
    const newAppt = new Appointment({
      patient: req.user._id,
      patientName: req.body.patientName,
      phone: req.body.phone,
      date: req.body.date,
      time: req.body.time,
      department: req.body.department,
      doctor: req.body.doctor || 'Chưa phân công',
      reason: req.body.reason
    });
    await newAppt.save();
    res.status(201).json({ success: true, data: newAppt });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
