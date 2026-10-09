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

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'CampusFind API',
    message: 'University Lost & Found API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'CampusFind API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

async function start() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing. Create server/.env from .env.example.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`CampusFind API running at http://localhost:${PORT}`);
    });
  }
}

start().catch(err => {
  console.error('Startup error:', err.message);
  process.exit(1);
});

export default app;
