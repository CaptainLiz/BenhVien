// models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },    // ví dụ: "2025-04-05"
  time: { type: String, required: true },    // ví dụ: "14:30"
  department: { type: String, required: true },
  doctor: { type: String, default: null },
  reason: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);