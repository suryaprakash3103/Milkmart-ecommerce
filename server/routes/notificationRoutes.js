import express from 'express';
import { db } from '../db/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', optionalAuth, (req, res) => {
  const all = db.get('notifications');
  const user = req.user;
  if (!user) {
    return res.json({ success: true, count: all.length, notifications: all });
  }

  const userNotifs = all.filter(n => n.sellerId === user.id || n.userId === user.id || !n.sellerId);
  return res.json({ success: true, count: userNotifs.length, notifications: userNotifs });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  const notif = db.find('notifications', n => n.id === req.params.id);
  if (!notif) {
    return res.status(404).json({ success: false, message: 'Notification not found.' });
  }
  const updated = db.update('notifications', notif.id, { read: true });
  return res.json({ success: true, notification: updated });
});

// PATCH /api/notifications/read-all
router.patch('/read-all', optionalAuth, (req, res) => {
  const all = db.get('notifications');
  const user = req.user;
  const updated = all.map(n => {
    if (!user || n.sellerId === user.id || n.userId === user.id || !n.sellerId) {
      return { ...n, read: true };
    }
    return n;
  });
  db.set('notifications', updated);
  return res.json({ success: true, message: 'All notifications marked as read.' });
});

export default router;
