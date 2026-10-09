import express from 'express';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const {
    search = '', type, category, building, status = 'ACTIVE'
  } = req.query;

  const query = {};
  if (status !== 'ALL') query.status = status;
  if (type && type !== 'ALL') query.type = type;
  if (category && category !== 'ALL') query.category = category;
  if (building && building !== 'ALL') query['location.building'] = building;

  if (search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: regex },
      { description: regex },
      { category: regex },
      { 'location.building': regex },
      { 'location.room': regex },
      { 'location.area': regex }
    ];
  }

  const items = await Item.find(query)
    .populate('reportedBy', 'name email studentId')
    .sort({ createdAt: -1 });

  res.json({ items });
});

router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate('reportedBy', 'name email studentId phone');

  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ item });
});

router.post('/', protect, async (req, res) => {
  const { title, description, category, type, building, room, area, date, imageUrl } = req.body;

  if (!title || !description || !category || !type || !building || !date) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const item = await Item.create({
    title, description, category, type, date, imageUrl,
    location: { building, room, area },
    reportedBy: req.user._id
  });

  const populated = await item.populate('reportedBy', 'name email studentId');
  res.status(201).json({ item: populated });
});

router.put('/:id', protect, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const isOwner = item.reportedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'You can only edit your own report' });
  }

  const allowed = ['title', 'description', 'category', 'type', 'date', 'imageUrl', 'status'];
  allowed.forEach(key => {
    if (req.body[key] !== undefined) item[key] = req.body[key];
  });

  if (req.body.building !== undefined || req.body.room !== undefined || req.body.area !== undefined) {
    item.location = {
      building: req.body.building ?? item.location.building,
      room: req.body.room ?? item.location.room,
      area: req.body.area ?? item.location.area
    };
  }

  await item.save();
  res.json({ item });
});

router.delete('/:id', protect, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const isOwner = item.reportedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Not allowed' });
  }

  await Claim.deleteMany({ item: item._id });
  await item.deleteOne();
  res.json({ message: 'Report deleted' });
});

router.patch('/:id/return', protect, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  if (req.user.role !== 'ADMIN' && item.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  item.status = 'RETURNED';
  await item.save();
  res.json({ item });
});

router.patch('/:id/verify', protect, adminOnly, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.status = req.body.status || 'ACTIVE';
  await item.save();
  res.json({ item });
});

export default router;
