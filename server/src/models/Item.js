import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  type: { type: String, enum: ['LOST', 'FOUND'], required: true },
  status: { type: String, enum: ['ACTIVE', 'CLAIMED', 'RETURNED'], default: 'ACTIVE' },
  location: {
    building: { type: String, required: true, trim: true },
    room: { type: String, trim: true, default: '' },
    area: { type: String, trim: true, default: '' }
  },
  date: { type: Date, required: true },
  imageUrl: { type: String, trim: true, default: '' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Item', itemSchema);
