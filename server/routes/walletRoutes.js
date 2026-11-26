import express from 'express';
import { db } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wallet
router.get('/', authenticate, (req, res) => {
  const allTx = db.get('wallet_tx');
  const userTx = allTx.filter(t => t.userId === req.user.id || !t.userId);
  return res.json({
    success: true,
    balance: req.user.walletBalance || 0,
    bottlesReturnedTotal: req.user.bottlesReturnedTotal || 0,
    transactions: userTx
  });
});

// POST /api/wallet/topup
router.post('/topup', authenticate, (req, res) => {
  try {
    const { amount, paymentMethod = 'UPI Auto-load' } = req.body;
    const addAmt = Number(amount);
    if (!addAmt || addAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid topup amount.' });
    }

    const currentBal = Number(req.user.walletBalance || 0);
    const newBal = currentBal + addAmt;

    db.update('users', req.user.id, { walletBalance: newBal });

    const newTx = {
      id: `tx-${Date.now()}`,
      userId: req.user.id,
      date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      type: 'credit',
      amount: addAmt,
      title: 'MilkMart Wallet Top-Up',
      description: `${paymentMethod} • Added funds for morning milk deliveries`,
      balanceAfter: newBal
    };
    db.insert('wallet_tx', newTx);

    return res.json({
      success: true,
      message: `₹${addAmt} added to your MilkMart Wallet!`,
      balance: newBal,
      transaction: newTx
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to topup wallet.' });
  }
});

export default router;
