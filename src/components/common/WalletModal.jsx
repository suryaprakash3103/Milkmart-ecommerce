import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, Wallet, ArrowDownRight, ArrowUpRight, Plus, Sparkles, RefreshCcw } from 'lucide-react';
import { WalletIcon } from './WalletIcon';

export const WalletModal = ({ isOpen, onClose }) => {
  const { currentUser, addWalletBalance } = useAuth();
  const { showToast } = useToast();
  const [topUpAmount, setTopUpAmount] = useState('500');

  if (!isOpen) return null;

  const handleTopUp = (e) => {
    e.preventDefault();
    const val = Number(topUpAmount);
    if (!val || val <= 0) return;
    addWalletBalance(val);
    showToast(`Added ₹${val} to your MilkMart Wallet!`);
  };

  const quickAmounts = [200, 500, 1000, 2000];

  const mockTransactions = [
    { id: "TX-901", type: "credit", title: "Empty Glass Bottle Return (2 Bottles)", amount: 20, date: "Today 6:45 AM" },
    { id: "TX-900", type: "debit", title: "Morning Doorstep Milk Run #MM-98241", amount: 220, date: "Yesterday 9:15 PM" },
    { id: "TX-899", type: "credit", title: "Wallet Auto-Topup via UPI", amount: 1000, date: "Sep 15, 2026" },
    { id: "TX-898", type: "credit", title: "Empty Glass Bottle Return (3 Bottles)", amount: 30, date: "Sep 14, 2026" }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '24px',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              color: '#FAF7F2',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FAF5EE',
              border: '1px solid rgba(232, 197, 130, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <WalletIcon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#E8C582', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
                MilkMart Eco-Pass
              </div>
              <h3 style={{ color: '#FAF7F2', fontSize: '1.25rem', margin: 0 }}>
                Dairy Wallet &amp; Bottle Credits
              </h3>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(232, 197, 130, 0.25)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#CBD5CB' }}>Available Balance</span>
              <div style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#E8C582',
                marginTop: '2px'
              }}>
                ₹{currentUser.walletBalance}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.78rem', color: '#CBD5CB' }}>Glass Bottles Returned</span>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#FAF7F2', marginTop: '4px' }}>
                {currentUser.bottlesReturnedTotal} Bottles (₹{currentUser.bottlesReturnedTotal * 10} credited)
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '22px' }}>
          {/* Top up form */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#183626', marginBottom: '8px' }}>
              Top Up Wallet (Instant Mock Credit)
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(String(amt))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: topUpAmount === String(amt) ? '2px solid #183626' : '1px solid #E6DEC9',
                    backgroundColor: topUpAmount === String(amt) ? '#FAF5EE' : '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    color: '#183626'
                  }}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <form onSubmit={handleTopUp} style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#798C80' }}>
                  ₹
                </span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{ width: '100%', paddingLeft: '32px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} /> Add Funds
              </button>
            </form>
          </div>

          {/* Interactive Bottle Return Ledger & Action */}
          <div style={{
            backgroundColor: '#E8F5EE',
            border: '1.5px solid rgba(25, 109, 61, 0.25)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#166534', fontSize: '0.92rem' }}>
                <RefreshCcw size={18} color="#166534" />
                Glass Bottle Return Passbook
              </div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                ₹10 / BOTTLE CASHBACK
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#183626', margin: '0 0 12px 0', lineHeight: 1.45 }}>
              Hand over empty rinsed glass bottles during your morning delivery run. Tap below to simulate doorstep driver bottle scan:
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    const credit = count * 10;
                    addWalletBalance(credit);
                    showToast(`Returned ${count} bottles! Credited ₹${credit} to your wallet.`);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #166534',
                    color: '#166534',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCcw size={14} /> Return {count} ({count * 10 > 0 ? `+₹${count * 10}` : ''})
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#183626', marginBottom: '12px' }}>
              Recent Transactions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #EFE8D8'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: tx.type === 'credit' ? '#E8F5EE' : '#FDE8E4',
                      color: tx.type === 'credit' ? '#196D3D' : '#B2341A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {tx.type === 'credit' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#183626' }}>
                        {tx.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#798C80' }}>
                        {tx.date}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontWeight: '700',
                    fontSize: '0.92rem',
                    color: tx.type === 'credit' ? '#196D3D' : '#B2341A'
                  }}>
                    {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
