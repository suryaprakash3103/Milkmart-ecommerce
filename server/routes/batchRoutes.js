import express from 'express';
import { db } from '../db/database.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/batches
router.get('/', optionalAuth, (req, res) => {
  const { sellerId } = req.query;
  let batches = db.get('batches');
  if (sellerId) {
    batches = batches.filter(b => b.sellerId === sellerId);
  }
  return res.json({ success: true, count: batches.length, batches });
});

// GET /api/batches/:id
router.get('/:id', (req, res) => {
  const batch = db.find('batches', b => b.id === req.params.id);
  if (!batch) {
    return res.status(404).json({ success: false, message: 'Batch certificate not found.' });
  }
  return res.json({ success: true, batch });
});

// POST /api/batches (Log morning batch)
router.post('/', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const data = req.body;
    const id = `BATCH-GIR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBatch = {
      id,
      sellerId: req.user.id,
      farmName: req.user.farmName || 'Gir Amrit Organic Gaushala',
      farmerName: req.user.name || 'Devendra Patel',
      date: new Date().toISOString().split('T')[0],
      milkingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Verified & Bottled for Sunrise Run",
      labCertNumber: `FSSAI-NABL-KA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...data
    };

    db.insert('batches', newBatch);
    return res.status(201).json({ success: true, batch: newBatch });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create batch.' });
  }
});

export default router;
