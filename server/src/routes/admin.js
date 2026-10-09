import express from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', async (req, res) => {
  const [users, lost, found, returned, pendingClaims] = await Promise.all([
    User.countDocuments(),
    Item.countDocuments({ type: 'LOST' }),
    Item.countDocuments({ type: 'FOUND' }),
    Item.countDocuments({ status: 'RETURNED' }),
    Claim.countDocuments({ status: 'PENDING' })
  ]);

  res.json({ stats: { users, lost, found, returned, pendingClaims } });
});

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
});

export default router;
