import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Tag, Plus, Check, Copy } from 'lucide-react';

export const AdminOffers = () => {
  const { showToast } = useToast();

  const [coupons, setCoupons] = useState([
    { code: 'MILK10', discount: '10% OFF', description: 'Applies to all daily milk and fresh curd items', active: true, usageCount: 412 },
    { code: 'FREEDEL', discount: 'Free Delivery', description: 'Zero delivery fee on morning runs under ₹199', active: true, usageCount: 290 },
    { code: 'FARM50', discount: '₹50 Flat OFF', description: '₹50 off on orders above ₹400', active: true, usageCount: 178 },
    { code: 'COWFIRST', discount: '15% OFF', description: '15% discount for first-time A2 cow milk orders', active: true, usageCount: 88 }
  ]);

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;
    setCoupons([...coupons, {
      code: newCode.toUpperCase(),
      discount: newDiscount,
      description: newDesc || "Special promotional offer",
      active: true,
      usageCount: 0
    }]);
    setNewCode('');
    setNewDiscount('');
    setNewDesc('');
    showToast(`Created coupon code '${newCode.toUpperCase()}'!`);
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied '${code}' to clipboard!`);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
          Offers &amp; Coupon Codes Management
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
          Configure seasonal farm discounts, welcome vouchers, and free morning run promos
        </p>
      </div>

      {/* Add Coupon Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E6DEC9',
        padding: '22px',
        marginBottom: '28px'
      }}>
        <h3 style={{ fontSize: '1.15rem', color: '#183626', marginBottom: '14px' }}>
          Create New Discount Coupon
        </h3>
        <form onSubmit={handleAddCoupon} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Code (e.g. SUMMER20)</label>
            <input type="text" required value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="COUPON10" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Discount Label</label>
            <input type="text" required value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} placeholder="e.g. 20% OFF" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>Terms / Description</label>
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" style={{ width: '100%' }} />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={16} /> Create Coupon
            </button>
          </div>
        </form>
      </div>

      {/* Existing Coupons Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
        {coupons.map((c) => (
          <div
            key={c.code}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E6DEC9',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  color: '#183626',
                  backgroundColor: '#FAF5EE',
                  border: '1px dashed #A26D24',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  {c.code}
                </span>
                <span style={{ fontSize: '0.74rem', backgroundColor: '#E8F5EE', color: '#196D3D', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  Active
                </span>
              </div>

              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#8E5A17', marginBottom: '4px' }}>
                {c.discount}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#798C80', lineHeight: 1.4, margin: '0 0 14px 0' }}>
                {c.description}
              </p>
            </div>

            <div style={{
              borderTop: '1px solid #F1EDE3',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem'
            }}>
              <span style={{ color: '#55685C' }}>{c.usageCount} times redeemed</span>
              <button
                onClick={() => copyCoupon(c.code)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#183626',
                  fontWeight: '700',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Copy size={13} /> Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
