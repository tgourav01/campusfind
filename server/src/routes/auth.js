import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const safeUser = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  studentId: user.studentId,
  phone: user.phone,
  role: user.role
});

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const studentId = String(req.body.studentId || '').trim();
  const phone = String(req.body.phone || '').trim();
  const role = ['STUDENT', 'STAFF'].includes(req.body.role) ? req.body.role : 'STUDENT';

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  if (await User.findOne({ email })) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const user = await User.create({
    name, email, password: await bcrypt.hash(password, 10), studentId, phone, role
  });

  res.status(201).json({ token: signToken(user._id), user: safeUser(user) });
});

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: signToken(user._id), user: safeUser(user) });
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: safeUser(req.user) });
});

export default router;
