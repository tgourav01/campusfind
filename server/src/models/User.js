import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  studentId: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  role: { type: String, enum: ['STUDENT', 'STAFF', 'ADMIN'], default: 'STUDENT' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
