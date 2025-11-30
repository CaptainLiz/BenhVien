require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB lỗi:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/appointments', require('./routes/appointmentRoutes.js'));

app.get('/', (req, res) => res.send('Backend chạy ngon!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy port ${PORT}`));
