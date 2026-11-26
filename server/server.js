import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/database.js';
import { connectDB, getMongoStatus } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads serving
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// System & Database Health Check
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'online',
    platform: 'MilkMart Pure Farmstead Fullstack API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      type: 'MongoDB (with local persistence fallback)',
      mongodb: getMongoStatus(),
      collections: {
        users: db.get('users').length,
        products: db.get('products').length,
        farms: db.get('farms').length,
        orders: db.get('orders').length,
        subscriptions: db.get('subscriptions').length,
        batches: db.get('batches').length
      }
    }
  });
});

// Database Status Endpoint
app.get('/api/database/status', (req, res) => {
  const mongo = getMongoStatus();
  return res.json({
    success: true,
    mongodb: mongo,
    syncMode: mongo.connected ? 'Active MongoDB Primary' : 'Local Disk-Persisted Fallback',
    metrics: {
      totalUsers: db.get('users').length,
      totalProducts: db.get('products').length,
      totalFarms: db.get('farms').length,
      totalOrders: db.get('orders').length,
      totalSubscriptions: db.get('subscriptions').length
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🥛 MilkMart Backend API Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🍃 Database Status: http://localhost:${PORT}/api/database/status`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  console.error('Express Server Error:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
