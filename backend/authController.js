// backend/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Đăng ký
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: 'Email đã tồn tại!' });

    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'patient'   // mặc định là bệnh nhân
    });

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Sai email hoặc mật khẩu!' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Sai email hoặc mật khẩu!' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};