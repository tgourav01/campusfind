
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import claimRoutes from './routes/claims.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Allowed frontend origins
const allowedOrigins = (
  process.env.CLIENT_URL ||
  'http://localhost:5173,https://campusfind-jet.vercel.app'
)
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin
      ? origin.replace(/\/+$/, '')
      : '';

    if (
      !origin ||
      allowedOrigins.includes(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    console.error(
      `CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`
    );

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'CampusFind API',
    message: 'University Lost & Found API is running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'CampusFind API'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

// Start server after connecting to MongoDB
async function start() {
  if (!process.env.MONGO_URI) {
    console.error(
      'MONGO_URI is missing. Configure it in server/.env or Render environment variables.'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CampusFind API running on port ${PORT}`);
      console.log('Allowed frontend origins:', allowedOrigins);
    });
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
}

start();

export default app;
