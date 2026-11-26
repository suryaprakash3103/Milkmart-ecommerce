import express from 'express';
import { db } from '../db/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/subscriptions
router.get('/', optionalAuth, (req, res) => {
  const all = db.get('subscriptions');
  const user = req.user;
  if (!user || user.role === 'admin') {
    return res.json({ success: true, count: all.length, subscriptions: all });
  }

  const userSubs = all.filter(s => s.userId === user.id || !s.userId);
  return res.json({ success: true, count: userSubs.length, subscriptions: userSubs.length > 0 ? userSubs : all });
});

// POST /api/subscriptions
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      product,
      size = "1 L",
      quantity = 1,
      frequency = "Daily",
      timeSlot = "Morning Run (5:30 AM – 7:30 AM)",
      deliveryAddress,
      instructions = "Leave inside insulated pouch",
      customSchedule = null
    } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({ success: false, message: 'Valid product is required.' });
    }

    const subNum = Math.floor(1000 + Math.random() * 9000);
    const id = `SUB-${subNum}`;

    let unitPrice = Number(product.price || 85);
    if (product.availableSizes && Array.isArray(product.availableSizes)) {
      const variant = product.availableSizes.find(v => v.size === size);
      if (variant) unitPrice = Number(variant.price);
    }
    const discountedPrice = Number((unitPrice * 0.9).toFixed(1)); // 10% subscription saving

    const user = req.user;
    const newSub = {
      id,
      userId: user?.id || 'usr-cust-01',
      productId: product.id,
      productName: product.name,
      brand: product.brand || 'Artisan Farm Dairy',
      image: product.image || '/images/products/milk-a2.jpg',
      size,
      quantity: Number(quantity),
      frequency,
      pricePerDay: discountedPrice * Number(quantity),
      originalPricePerDay: unitPrice * Number(quantity),
      status: "Active",
      nextDeliveryDate: "Tomorrow (5:30 AM)",
      timeSlot,
      deliveryAddress: typeof deliveryAddress === 'string' 
        ? deliveryAddress 
        : `${deliveryAddress?.house || 'Doorstep'}, ${deliveryAddress?.street || ''}, ${deliveryAddress?.city || 'Bengaluru'}`,
      startDate: new Date().toISOString().split('T')[0],
      totalDeliveriesDone: 0,
      bottlesPendingReturn: 0,
      customSchedule,
      doorstepInstructions: instructions
    };

    db.insert('subscriptions', newSub);
    return res.status(201).json({ success: true, subscription: newSub });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create subscription.' });
  }
});

// PATCH /api/subscriptions/:id/pause
router.patch('/:id/pause', (req, res) => {
  const sub = db.find('subscriptions', s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscription not found.' });
  }
  const updated = db.update('subscriptions', sub.id, { status: 'Paused' });
  return res.json({ success: true, subscription: updated });
});

// PATCH /api/subscriptions/:id/resume
router.patch('/:id/resume', (req, res) => {
  const sub = db.find('subscriptions', s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscription not found.' });
  }
  const updated = db.update('subscriptions', sub.id, { status: 'Active' });
  return res.json({ success: true, subscription: updated });
});

// PATCH /api/subscriptions/:id/skip
router.patch('/:id/skip', (req, res) => {
  const sub = db.find('subscriptions', s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscription not found.' });
  }
  const updated = db.update('subscriptions', sub.id, {
    nextDeliveryDate: "Day after tomorrow (Skipped tomorrow's run)"
  });
  return res.json({ success: true, subscription: updated });
});

// PATCH /api/subscriptions/:id/quantity
router.patch('/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  const sub = db.find('subscriptions', s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscription not found.' });
  }

  const qty = Math.max(1, Number(quantity));
  const singleUnit = sub.pricePerDay / sub.quantity;
  const singleOrig = sub.originalPricePerDay / sub.quantity;

  const updated = db.update('subscriptions', sub.id, {
    quantity: qty,
    pricePerDay: Number((singleUnit * qty).toFixed(1)),
    originalPricePerDay: Number((singleOrig * qty).toFixed(1))
  });
  return res.json({ success: true, subscription: updated });
});

// DELETE /api/subscriptions/:id
router.delete('/:id', (req, res) => {
  db.delete('subscriptions', req.params.id);
  return res.json({ success: true, message: 'Subscription cancelled successfully.' });
});

export default router;
