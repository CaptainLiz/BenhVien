// routes/appointments.js – CHỈ CẦN FILE NÀY LÀ XONG!
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth'); // nếu bạn có middleware auth

// Nếu bạn chưa có middleware protect, dùng cái đơn giản này:
const jwt = require('jsonwebtoken');
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Không có token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token không hợp lệ' });
  }
};

// ĐẶT LỊCH
router.post('/', protect, async (req, res) => {
  try {
    const appt = new Appointment({
      patient: req.user.id,
      patientName: req.body.patientName,
      phone: req.body.phone,
      date: req.body.date,
      time: req.body.time,
      department: req.body.department,
      doctor: req.body.doctor,
      reason: req.body.reason || ''
    });
    await appt.save();
    res.status(201).json({ success: true, data: appt });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// LẤY LỊCH CỦA BỆNH NHÂN (QUAN TRỌNG NHẤT!)
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;