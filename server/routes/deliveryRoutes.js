import express from 'express';
import { db } from '../db/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/delivery/route (Morning Delivery Manifest)
router.get('/route', optionalAuth, (req, res) => {
  const orders = db.get('orders');
  // Find orders for route 4B or active morning deliveries
  const activeRoute = orders.filter(o => 
    o.status !== 'Cancelled' &&
    (o.status === 'Confirmed' || o.status === 'Out for Delivery' || o.status === 'Delivered')
  );

  return res.json({
    success: true,
    routeId: 'ROUTE-4B-EAST',
    routeName: 'Route 4B - HSR Layout & Bellandur Sunrise Run',
    driver: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      vehicle: 'Electric Chilled Van (KA01-EK-4501)',
      chillerTemp: '3.6°C'
    },
    totalStops: activeRoute.length,
    deliveries: activeRoute
  });
});

// POST /api/delivery/complete (Doorstep delivery confirmation + Glass Bottle Auto-Credit)
router.post('/complete', optionalAuth, (req, res) => {
  try {
    const {
      orderId,
      bottlesDelivered = 1,
      bottlesCollected = 0,
      photoUrl = null,
      notes = "",
      silentAcknowledged = true
    } = req.body;

    const q = String(orderId || '').toLowerCase().replace(/^#/, '');
    const order = db.find('orders', o => 
      String(o.id).toLowerCase() === q ||
      String(o.id).toLowerCase() === `ord-${q}` ||
      q === String(o.id).toLowerCase().replace(/^ord-/, '')
    );

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let customerName = "Valued Customer";
    let customerAddress = "Doorstep";

    if (order) {
      customerName = order.deliveryAddress?.name || customerName;
      customerAddress = `${order.deliveryAddress?.house || ''}, ${order.deliveryAddress?.street || ''}`;

      const updatedTimeline = (order.timeline || []).map(s => {
        if (s.title.toLowerCase().includes('delivered') || s.title.toLowerCase().includes('doorstep')) {
          return { ...s, completed: true, active: true, time: now };
        }
        return s;
      });

      db.update('orders', order.id, {
        status: 'Delivered',
        sellerStatus: 'Delivered',
        deliveredAt: now,
        bottlesReturned: (order.bottlesReturned || 0) + Number(bottlesCollected),
        dropPhoto: photoUrl,
        partnerNotes: notes,
        silentDeliveryVerified: silentAcknowledged,
        timeline: updatedTimeline
      });
    }

    // 2. If bottles collected, calculate cashback (₹10/bottle) and credit customer wallet
    const collectedCount = Number(bottlesCollected);
    const creditAmount = collectedCount * 10;

    // Find customer to credit
    const users = db.get('users');
    const customer = (order && order.userId) 
      ? db.find('users', u => u.id === order.userId)
      : users.find(u => u.name.toLowerCase() === customerName.toLowerCase() || u.role === 'customer');

    if (creditAmount > 0 && customer) {
      const newBal = (customer.walletBalance || 0) + creditAmount;
      db.update('users', customer.id, {
        walletBalance: newBal,
        bottlesReturnedTotal: (customer.bottlesReturnedTotal || 0) + collectedCount
      });

      db.insert('wallet_tx', {
        id: `tx-${Date.now()}`,
        userId: customer.id,
        date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        type: 'credit',
        amount: creditAmount,
        title: `Glass Bottle Return Credit (${collectedCount} bottles)`,
        description: `Doorstep return verified by delivery partner • +₹10 each`,
        balanceAfter: newBal
      });
    }

    // 3. Log to Bottle Log
    const newBottleEntry = {
      id: `bot-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: now,
      orderId: order?.id || orderId,
      partnerName: req.user?.name || "Ramesh Kumar",
      partnerId: req.user?.id || "usr-del-01",
      customerName,
      customerAddress,
      bottlesDelivered: Number(bottlesDelivered),
      bottlesCollected: collectedCount,
      creditGiven: creditAmount,
      condition: "Rinsed & Intact European Glass",
      silentDelivery: silentAcknowledged,
      photoUrl
    };
    db.insert('bottle_logs', newBottleEntry);

    // 4. Update Partner stats if logged in
    if (req.user && req.user.role === 'delivery') {
      db.update('users', req.user.id, {
        completedDeliveries: (req.user.completedDeliveries || 0) + 1,
        bottlesCollectedCount: (req.user.bottlesCollectedCount || 0) + collectedCount
      });
    }

    return res.json({
      success: true,
      message: `Delivery completed! ${collectedCount > 0 ? `₹${creditAmount} credited to customer wallet.` : ''}`,
      bottleEntry: newBottleEntry
    });
  } catch (err) {
    console.error('Error completing delivery:', err);
    return res.status(500).json({ success: false, message: 'Failed to complete delivery.' });
  }
});

// GET /api/delivery/bottles
router.get('/bottles', (req, res) => {
  const logs = db.get('bottle_logs');
  return res.json({ success: true, count: logs.length, logs });
});

export default router;
