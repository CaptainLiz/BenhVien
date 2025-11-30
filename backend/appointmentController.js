// controllers/appointmentController.js
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// ĐẶT LỊCH – LƯU VÀO MONGODB
export const createAppointment = async (req, res) => {
  try {
    const { date, time, department, doctor, reason, patientName, phone } = req.body;
    const patientId = req.user.id; // từ middleware auth

    const newAppointment = new Appointment({
      patient: patientId,
      patientName,
      phone,
      date,
      time,
      department,
      doctor: doctor || null,
      reason,
      status: 'pending' // chờ duyệt
    });

    await newAppointment.save();

    // Đẩy vào lịch của bệnh nhân luôn
    await User.findByIdAndUpdate(patientId, {
      $push: { appointments: newAppointment._id }
    });

    res.status(201).json({
      success: true,
      message: 'Đặt lịch thành công!',
      data: newAppointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// LẤY LỊCH CỦA BỆNH NHÂN
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .sort({ createdAt: -1 }); // mới nhất trước

    res.json({
      success: true,
      data: appointments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};