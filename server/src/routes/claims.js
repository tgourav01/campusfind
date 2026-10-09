import express from 'express';
import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { itemId, reason, verification } = req.body;

  if (!itemId || !reason || !verification) {
    return res.status(400).json({ message: 'Claim details are required' });
  }

  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.status !== 'ACTIVE') return res.status(400).json({ message: 'This item is not available for claims' });
  if (item.reportedBy.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot claim your own report' });
  }

  const existing = await Claim.findOne({
    item: itemId,
    claimant: req.user._id,
    status: 'PENDING'
  });

  if (existing) return res.status(409).json({ message: 'You already have a pending claim' });

  const claim = await Claim.create({
    item: itemId,
    claimant: req.user._id,
    reason,
    verification
  });

  res.status(201).json({ claim });
});

router.get('/mine', protect, async (req, res) => {
  const claims = await Claim.find({ claimant: req.user._id })
    .populate('item')
    .sort({ createdAt: -1 });

  res.json({ claims });
});

router.get('/for-my-items', protect, async (req, res) => {
  const items = await Item.find({ reportedBy: req.user._id }).select('_id');
  const ids = items.map(i => i._id);
  const claims = await Claim.find({ item: { $in: ids } })
    .populate('item')
    .populate('claimant', 'name email studentId phone')
    .sort({ createdAt: -1 });

  res.json({ claims });
});

router.get('/all', protect, adminOnly, async (req, res) => {
  const claims = await Claim.find()
    .populate('item')
    .populate('claimant', 'name email studentId phone')
    .sort({ createdAt: -1 });

  res.json({ claims });
});

router.patch('/:id', protect, async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate('item');
  if (!claim) return res.status(404).json({ message: 'Claim not found' });

  const isReporter = claim.item.reportedBy.toString() === req.user._id.toString();
  if (!isReporter && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Not allowed' });
  }

  const status = req.body.status;
  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  claim.status = status;
  await claim.save();

  if (status === 'APPROVED') {
    claim.item.status = 'RETURNED';
    await claim.item.save();
    await Claim.updateMany(
      { item: claim.item._id, _id: { $ne: claim._id }, status: 'PENDING' },
      { status: 'REJECTED' }
    );
  }

  res.json({ claim });
});

export default router;
