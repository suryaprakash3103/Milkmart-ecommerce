import mongoose from 'mongoose';
import { db } from '../db/database.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/milkmart';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });

    isMongoConnected = true;
    console.log(`\n======================================================`);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`======================================================\n`);

    // Auto-seed if database is empty
    await seedMongoDBIfEmpty();

    return conn;
  } catch (error) {
    isMongoConnected = false;
    console.log(`\n======================================================`);
    console.log(`⚠️  MongoDB Connection Notice:`);
    console.log(`   Unable to reach MongoDB at ${uri} (${error.message})`);
    console.log(`🛡️  MilkMart is operating seamlessly in High-Resilience Mode`);
    console.log(`   using disk-persisted atomic JSON storage.`);
    console.log(`======================================================\n`);
    return null;
  }
};

export const getMongoStatus = () => {
  return {
    connected: isMongoConnected && mongoose.connection.readyState === 1,
    state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'disconnected',
    uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@') : 'mongodb://127.0.0.1:27017/milkmart'
  };
};

async function seedMongoDBIfEmpty() {
  try {
    const { User } = await import('../models/User.js');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🍃 Auto-seeding MongoDB collections with MilkMart dairy datasets...');
      const { Product } = await import('../models/Product.js');
      const { Farm } = await import('../models/Farm.js');
      const { Order } = await import('../models/Order.js');
      const { Subscription } = await import('../models/Subscription.js');
      const { Batch } = await import('../models/Batch.js');
      const { Review } = await import('../models/Review.js');
      const { Notification } = await import('../models/Notification.js');

      await Promise.all([
        User.insertMany(db.get('users')),
        Product.insertMany(db.get('products')),
        Farm.insertMany(db.get('farms')),
        Order.insertMany(db.get('orders')),
        Subscription.insertMany(db.get('subscriptions')),
        Batch.insertMany(db.get('batches')),
        Review.insertMany(db.get('reviews')),
        Notification.insertMany(db.get('notifications'))
      ]);
      console.log('✅ MongoDB collections populated successfully with full dairy marketplace catalog!');
    }
  } catch (err) {
    console.warn('MongoDB seed warning:', err.message);
  }
}
