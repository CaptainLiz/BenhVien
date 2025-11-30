// backend/middleware/authMiddleware.js – COMMONJS – CHẠY NGON VỚI BACKEND HIỆN TẠI
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Hỗ trợ cả 2 kiểu header mà frontend có thể gửi
  if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, msg: 'Không có token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id || decoded._id).select('-password');
    if (!user) return res.status(401).json({ success: false, msg: 'User không tồn tại' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Token lỗi:', err.message);
    return res.status(401).json({ success: false, msg: 'Token hết hạn hoặc không hợp lệ' });
  }
};

module.exports = { protect };
