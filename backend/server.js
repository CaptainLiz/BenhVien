const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'patient' }
});
const User = mongoose.model('User', userSchema);

// Appointment Model
const appointmentSchema = new mongoose.Schema({
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  doctorName: String,
  specialty: String,
  date: String,
  time: String,
  room: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Routes
app.get('/', (req, res) => res.send('Backend Bệnh Viện ABC - Chạy ngon lành!'));

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: 'Email đã tồn tại' });
    const user = await User.create({ name, email, password, phone });
    res.json({ msg: 'OK', user: { name, email, role: user.role } });
  } catch (e) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ msg: 'Sai email hoặc mật khẩu' });
    }
    res.json({ name: user.name, email: user.email, role: user.role });
  } catch (e) {
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

app.get('/api/appointments', async (req, res) => {
  const apps = await Appointment.find().sort({ createdAt: -1 });
  res.json(apps);
});

app.post('/api/appointments', async (req, res) => {
  const appt = await Appointment.create(req.body);
  res.json(appt);
});

app.put('/api/appointments/:id', async (req, res) => {
  const { status } = req.body;
  const appt = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(appt || { msg: 'Not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy port ${PORT}`));
