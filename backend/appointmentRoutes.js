// routes/appointmentRoutes.js
import express from 'express';
import { createAppointment, getMyAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAppointment);           // Đặt lịch
router.get('/my', protect, getMyAppointments);          // Lấy lịch của tôi

export default router;