require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ message: 'Campus Lost & Found API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// 404 for unknown API routes
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: errors[0], errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid value supplied' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set. Copy backend/.env.example to backend/.env and set it.');
    process.exit(1);
  }
  try {
    await connectDB();
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Make sure MongoDB Server is running and MONGO_URI in backend/.env is correct.');
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

start();
