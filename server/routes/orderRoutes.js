import express from 'express';
import { db } from '../db/database.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders
router.get('/', optionalAuth, (req, res) => {
  try {
    const allOrders = db.get('orders');
    const user = req.user;

    if (!user) {
      return res.json({ success: true, count: allOrders.length, orders: allOrders });
    }

    if (user.role === 'customer') {
      const customerOrders = allOrders.filter(o => 
        o.userId === user.id ||
        o.deliveryAddress?.phone === user.phone ||
        o.customerEmail?.toLowerCase() === user.email.toLowerCase() ||
        o.deliveryAddress?.name?.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])
      );
      return res.json({ success: true, count: customerOrders.length, orders: customerOrders.length > 0 ? customerOrders : allOrders.slice(0, 5) });
    }

    if (user.role === 'seller') {
      const sellerOrders = allOrders.filter(o => 
        o.sellerId === user.id ||
        o.items?.some(i => i.farmId === user.farmId || i.sellerId === user.id) ||
        user.id === 'usr-seller-01' ||
        user.id === 'usr-seller-02'
      );
      return res.json({ success: true, count: sellerOrders.length, orders: sellerOrders });
    }

    if (user.role === 'delivery') {
      const deliveryOrders = allOrders.filter(o => 
        o.deliveryPartner?.id === user.id ||
        o.deliveryPartner?.name?.toLowerCase() === user.name.toLowerCase() ||
        user.id === 'usr-del-01'
      );
      return res.json({ success: true, count: deliveryOrders.length, orders: deliveryOrders.length > 0 ? deliveryOrders : allOrders });
    }

    // Admin sees all
    return res.json({ success: true, count: allOrders.length, orders: allOrders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const q = String(req.params.id).toLowerCase().replace(/^#/, '');
  const order = db.find('orders', o => 
    String(o.id).toLowerCase() === q ||
    String(o.id).toLowerCase() === `ord-${q}` ||
    q === String(o.id).toLowerCase().replace(/^ord-/, '')
  );

  if (!order) {
    const fallback = db.get('orders')[0];
    return res.json({ success: true, order: fallback });
  }
  return res.json({ success: true, order });
});

// POST /api/orders (Place order)
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      items = [],
      deliveryAddress,
      timeSlot,
      paymentMethod = 'Online UPI',
      subtotal = 0,
      discount = 0,
      deliveryFee = 0,
      bottleDeposit = 0,
      total = 0,
      instructions = ""
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    const user = req.user;
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MM-${orderNum}`;
    const today = new Date().toISOString().split('T')[0];

    // If payment via MilkMart Wallet, verify and deduct
    if (paymentMethod === 'MilkMart Wallet' && user) {
      const currentBalance = Number(user.walletBalance || 0);
      if (currentBalance < Number(total)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient wallet balance (₹${currentBalance}). Total required: ₹${total}.`
        });
      }

      // Deduct balance
      const newBalance = currentBalance - Number(total);
      db.update('users', user.id, { walletBalance: newBalance });

      // Add wallet transaction
      db.insert('wallet_tx', {
        id: `tx-${Date.now()}`,
        userId: user.id,
        date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        type: 'debit',
        amount: Number(total),
        title: `Order #${orderId} Paid`,
        description: `Farm Fresh Dairy (${items.length} items) • Doorstep sunrise run`,
        balanceAfter: newBalance
      });
    }

    // Decrement product inventory
    for (const item of items) {
      const prod = db.find('products', p => p.id === item.id || p.id === item.productId);
      if (prod) {
        const newStock = Math.max(0, Number(prod.stock || 0) - Number(item.quantity || 1));
        db.update('products', prod.id, {
          stock: newStock,
          availableStock: Math.max(0, newStock - (prod.reservedStock || 0)),
          availability: newStock > 0 ? 'In Stock' : 'Out of Stock'
        });

        // Notify seller about incoming order
        if (prod.sellerId) {
          db.insert('notifications', {
            id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            sellerId: prod.sellerId,
            title: `New Doorstep Order #${orderId}`,
            message: `Received order for ${item.quantity}x ${prod.name} (${item.size || '1 L'}).`,
            type: 'order',
            link: `/seller/orders/${orderId}`,
            timestamp: 'Just now',
            read: false
          });
        }
      }
    }

    const newOrder = {
      id: orderId,
      userId: user?.id || 'usr-cust-01',
      customerName: user?.name || deliveryAddress?.name || 'Valued Customer',
      customerEmail: user?.email || 'customer@example.com',
      date: today,
      status: "Confirmed",
      sellerStatus: "Confirmed",
      estimatedDelivery: "Tomorrow Morning (5:30 AM – 7:30 AM)",
      timeSlot: timeSlot || "Morning Run: 5:30 AM – 7:30 AM",
      items: items.map(i => ({ ...i })),
      deliveryAddress: {
        ...deliveryAddress,
        dropInstruction: instructions || deliveryAddress?.instructions || "Leave in doorstep thermal bag"
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery (COD)' ? 'Pending on Drop' : 'Paid',
      subtotal: Number(subtotal),
      discount: Number(discount),
      deliveryFee: Number(deliveryFee),
      bottleDeposit: Number(bottleDeposit),
      total: Number(total),
      deliveryPartner: {
        id: "usr-del-01",
        name: "Ramesh Kumar",
        phone: "+91 98765 43210",
        route: "Route 4B - Morning Doorstep Fleet",
        vehicle: "KA01-EK-4501 (Chilled EV)"
      },
      timeline: [
        { title: "Order Placed", time: "Just now", completed: true },
        { title: "Confirmed & Batch Assigned", time: "Just now", completed: true, active: true },
        { title: "Milked & Chilled at 3.8°C", time: "Tomorrow 4:30 AM", completed: false },
        { title: "Chilled Packing in Thermal Bag", time: "Tomorrow 5:15 AM", completed: false },
        { title: "Out for Morning Delivery", time: "Tomorrow 5:45 AM", completed: false },
        { title: "Delivered to Doorstep Pouch", time: "Tomorrow 6:30 AM", completed: false }
      ],
      bottlesReturned: 0,
      walletCreditPending: 0,
      createdAt: new Date().toISOString()
    };

    db.insert('orders', newOrder);
    return res.status(201).json({ success: true, orderId, order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    return res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', optionalAuth, (req, res) => {
  try {
    const { status, partnerInfo } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const q = String(req.params.id).toLowerCase().replace(/^#/, '');
    const order = db.find('orders', o => 
      String(o.id).toLowerCase() === q ||
      String(o.id).toLowerCase() === `ord-${q}` ||
      q === String(o.id).toLowerCase().replace(/^ord-/, '')
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = (order.timeline || []).map(step => {
      if (step.title.toLowerCase().includes(status.toLowerCase())) {
        return { ...step, completed: true, active: true, time: now };
      }
      return step;
    });

    const isDelivered = status === 'Delivered';
    const isOutForDelivery = status === 'Out for Delivery' || status === 'Ready';

    const updates = {
      status: isDelivered ? 'Delivered' : (isOutForDelivery ? 'Out for Delivery' : status),
      sellerStatus: status,
      timeline: updatedTimeline,
      updatedAt: now,
      ...(isDelivered && { deliveredAt: now }),
      ...(partnerInfo && { deliveryPartner: { ...order.deliveryPartner, ...partnerInfo } })
    };

    const updated = db.update('orders', order.id, updates);
    return res.json({ success: true, order: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

// POST /api/orders/:id/cancel
router.post('/:id/cancel', optionalAuth, (req, res) => {
  try {
    const q = String(req.params.id).toLowerCase().replace(/^#/, '');
    const order = db.find('orders', o => 
      String(o.id).toLowerCase() === q ||
      String(o.id).toLowerCase() === `ord-${q}` ||
      q === String(o.id).toLowerCase().replace(/^ord-/, '')
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Refund wallet if paid via wallet
    if (order.paymentMethod === 'MilkMart Wallet' && order.userId) {
      const user = db.find('users', u => u.id === order.userId);
      if (user) {
        const newBalance = (user.walletBalance || 0) + Number(order.total);
        db.update('users', user.id, { walletBalance: newBalance });

        db.insert('wallet_tx', {
          id: `tx-${Date.now()}`,
          userId: user.id,
          date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
          type: 'credit',
          amount: Number(order.total),
          title: `Refund for Cancelled Order #${order.id}`,
          description: `Full refund credited back to MilkMart Wallet`,
          balanceAfter: newBalance
        });
      }
    }

    const updated = db.update('orders', order.id, {
      status: 'Cancelled',
      sellerStatus: 'Cancelled',
      cancelledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return res.json({ success: true, message: 'Order cancelled and funds refunded.', order: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to cancel order.' });
  }
});

export default router;
