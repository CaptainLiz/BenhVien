// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, msg: 'Không có quyền truy cập – thiếu token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, msg: 'Người dùng không tồn tại' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Token không hợp lệ hoặc hết hạn' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ success: false, msg: 'Chỉ Admin mới có quyền!' });
};

export const doctorOnly = (req, res, next) => {
  if (req.user?.role === 'doctor' || req.user?.role === 'admin') return next();
  return res.status(403).json({ success: false, msg: 'Chỉ bác sĩ mới có quyền!' });
};