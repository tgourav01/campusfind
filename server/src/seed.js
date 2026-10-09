import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Item from './models/Item.js';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusfind';

const run = async () => {
  await mongoose.connect(uri);

  const passwords = {
    admin: await bcrypt.hash('Admin@123', 10),
    student: await bcrypt.hash('Student@123', 10)
  };

  const admin = await User.findOneAndUpdate(
    { email: 'admin@campusfind.com' },
    {
      name: 'Campus Administrator',
      email: 'admin@campusfind.com',
      password: passwords.admin,
      studentId: 'ADMIN001',
      phone: '9876543210',
      role: 'ADMIN'
    },
    { upsert: true, new: true }
  );

  const student = await User.findOneAndUpdate(
    { email: 'student@campusfind.com' },
    {
      name: 'Demo Student',
      email: 'student@campusfind.com',
      password: passwords.student,
      studentId: 'STU2026001',
      phone: '9876500000',
      role: 'STUDENT'
    },
    { upsert: true, new: true }
  );

  if (await Item.countDocuments() === 0) {
    await Item.insertMany([
      {
        title: 'iPhone 15',
        description: 'Black iPhone with a transparent case. Small scratch near the camera.',
        category: 'Electronics',
        type: 'LOST',
        status: 'ACTIVE',
        location: { building: 'Block C', room: '204', area: 'Back row' },
        date: new Date('2026-10-06'),
        imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80',
        reportedBy: student._id
      },
      {
        title: 'Student ID Card',
        description: 'University ID card found near the library entrance.',
        category: 'ID Cards',
        type: 'FOUND',
        status: 'ACTIVE',
        location: { building: 'Library', room: '', area: 'Main entrance' },
        date: new Date('2026-10-05'),
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
        reportedBy: admin._id
      },
      {
        title: 'Blue Backpack',
        description: 'Navy blue backpack containing notebooks and a calculator.',
        category: 'Bags',
        type: 'FOUND',
        status: 'ACTIVE',
        location: { building: 'Block A', room: '101', area: 'Near window' },
        date: new Date('2026-10-04'),
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
        reportedBy: admin._id
      },
      {
        title: 'AirPods Pro',
        description: 'White AirPods case, initials G.T. written on the inside.',
        category: 'Electronics',
        type: 'LOST',
        status: 'ACTIVE',
        location: { building: 'Canteen', room: '', area: 'Second floor tables' },
        date: new Date('2026-10-03'),
        imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80',
        reportedBy: student._id
      },
      {
        title: 'Black Wallet',
        description: 'Black leather wallet. Owner can verify contents privately.',
        category: 'Wallets',
        type: 'FOUND',
        status: 'ACTIVE',
        location: { building: 'Block B', room: 'Ground Floor', area: 'Reception' },
        date: new Date('2026-10-02'),
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
        reportedBy: admin._id
      }
    ]);
  }

  console.log('Seed complete.');
  console.log('Admin: admin@campusfind.com / Admin@123');
  console.log('Student: student@campusfind.com / Student@123');

  await mongoose.disconnect();
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
