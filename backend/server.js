import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'https://benhvien-abc.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB kết nối thành công!'))
  .catch(err => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/appointments', require('./routes/appointments'));

// TRANG CHỦ SIÊU ĐẸP KHI TRUY CẬP localhost:5000
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bệnh Viện ABC - Backend Đã Sống!</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .gradient-bg { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%); }
    .pulse-animation { animation: pulse 2s infinite; }
  </style>
</head>
<body class="min-h-screen gradient-bg text-white flex items-center justify-center">
  <div class="text-center p-12 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 max-w-4xl mx-4">
    <div class="mb-8">
      <h1 class="text-6xl md:text-8xl font-extrabold mb-4 tracking-tight">
        BỆNH VIỆN ABC
      </h1>
      <p className="text-2xl md:text-4xl font-bold text-green-300">
        BACKEND ĐÃ CHẠY HOÀN HẢO 100%
      </p>
    </div>

    <div class="pulse-animation text-9xl mb-8">Checkmark</div>

    <div class="space-y-6 text-xl md:text-2xl">
      <p class="font-semibold">
        Thời gian: <span class="text-yellow-300">${new Date().toLocaleString('vi-VN')}</span>
      </p>
      <p class="text-green-300 font-bold text-3xl">
        Trạng thái: SẴN SÀNG CHO ĐỒ ÁN 
      </p>
    </div>

    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur">
        <p class="font-bold text-pink-300">API Đặt lịch</p>
        <code class="text-sm bg-black/30 px-3 py-1 rounded">POST /api/appointments</code>
      </div>
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur">
        <p class="font-bold text-cyan-300">Xem lịch của tôi</p>
        <code class="text-sm bg-black/30 px-3 py-1 rounded">GET /api/appointments/my</code>
      </div>
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur">
        <p class="font-bold text-emerald-300">Đăng ký</p>
        <code class="text-sm bg-black/30 px-3 py-1 rounded">POST /api/register</code>
      </div>
    </div>
  </div>
</body>
</html>
  `);
});

// Đăng ký bệnh nhân
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: 'Email đã được sử dụng!' });
    }

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone?.trim() || '',
      role: 'patient'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      msg: 'Đăng ký thành công!',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: 'patient' }
    });

  } catch (err) {
    console.error('Lỗi đăng ký:', err.message);
    res.status(500).json({ success: false, msg: 'Lỗi server!' });
  }
});

// 404 + Error Handler
app.use('*', (req, res) => {
  res.status(404).send(`
    <div style="font-family: system-ui; text-align: center; padding: 100px; background: #f8fafc; color: #1e293b;">
      <h1 style="font-size: 4rem; color: #ef4444;">404 - Không tìm thấy route</h1>
      <p style="font-size: 1.5rem;">Vui lòng kiểm tra lại URL hoặc quay về <a href="/" style="color: #3b82f6; text-decoration: underline;">trang chủ backend</a></p>
    </div>
  `);
});

app.use((err, req, res, next) => {
  console.error('Lỗi server:', err);
  res.status(500).json({ success: false, msg: 'Lỗi server!' });
});

// Khởi động server
app.listen(PORT, () => {
  console.log('=====================================');
  console.log(' BACKEND BỆNH VIỆN ABC ĐÃ MỞ !');
  console.log('=====================================');
  console.log(`TRANG CHỦ : http://localhost:${PORT}`);
  console.log(`Thời gian: ${new Date().toLocaleString('vi-VN')}`);
  console.log('BÂY GIỜ MỞ TRÌNH DUYỆT → GÕ localhost:5000!');
  console.log('=====================================');
});
