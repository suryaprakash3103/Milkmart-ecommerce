import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store } from '../../data/store';
import { useToast } from '../../context/ToastContext';
import { 
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, RefreshCcw, 
  CheckCircle2, Sparkles, ShieldCheck, CreditCard, ArrowLeft, 
  HelpCircle, Receipt 
} from 'lucide-react';
import { WalletIcon } from '../../components/common/WalletIcon';

export const CustomerWalletPage = () => {
  const { user, addWalletBalance } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI'); // UPI, Card, Netbanking

  const loadTransactions = () => {
    if (user?.id) {
      const txs = Store.getWalletTransactions(user.id);
      setTransactions(txs);
    }
  };

  useEffect(() => {
    loadTransactions();

    const handleSync = () => loadTransactions();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  const handleAddFunds = (e) => {
    e.preventDefault();
    const amount = Number(customAmount) || selectedPreset;
    if (amount <= 0) return;

    addWalletBalance(amount, `MilkMart Wallet Top-Up (${paymentMode})`, `Added funds via ${paymentMode}`);
    showToast(`Successfully added ₹${amount} to your MilkMart Wallet!`);
    setIsAddMoneyOpen(false);
    setCustomAmount('');
    loadTransactions();
  };

  return (
    <div style={{ padding: '36px 0 70px 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Breadcrumb & Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <Link to="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', fontWeight: '600', color: '#183626' }}>
            <ArrowLeft size={16} /> Back to Account Dashboard
          </Link>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/account/subscriptions" className="btn btn-ghost btn-sm">Subscriptions</Link>
            <Link to="/account/orders" className="btn btn-ghost btn-sm">Orders</Link>
          </div>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            MilkMart Passbook &amp; Wallet
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#55685C' }}>
            Manage prepaid dairy balance, automated morning debits, and +₹10 glass bottle return refunds
          </p>
        </div>

        {/* Top Wallet Banner Card */}
        <div style={{
          background: 'linear-gradient(135deg, #183626 0%, #224D36 100%)',
          color: '#FAF7F2',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 12px 36px rgba(24, 54, 38, 0.15)',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#E8C582', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              <WalletIcon size={20} /> Prepaid Dairy Balance
            </div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '3rem', fontWeight: '700', color: '#FAF7F2' }}>
              ₹{user?.walletBalance || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.84rem', color: '#CBD5CB', marginTop: '6px' }}>
              <span>✓ Auto-pays morning deliveries</span>
              <span>•</span>
              <span style={{ color: '#E8C582' }}>+₹10 added per return bottle</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="btn btn-primary btn-lg"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <Plus size={18} /> Add Money to Wallet
            </button>
          </div>
        </div>

        {/* Circular Bottle Return Info Banner */}
        <div style={{
          backgroundColor: '#E8F5EE',
          border: '1.5px solid rgba(25, 109, 61, 0.3)',
          borderRadius: '16px',
          padding: '18px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FFFFFF', color: '#196D3D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RefreshCcw size={22} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.95rem' }}>
                Glass Bottle Circular Return Loop (+₹10 / Bottle)
              </div>
              <div style={{ fontSize: '0.84rem', color: '#276A42', marginTop: '2px' }}>
                Rinse and leave empty glass bottles in your doorstep pouch. Driver Ramesh credits ₹10 per bottle directly to your wallet upon sunrise pickup!
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: '#276A42', fontWeight: '600' }}>Lifetime Bottles Returned:</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#196D3D' }}>
              {user?.bottlesReturnedTotal || 18} Bottles (₹{(user?.bottlesReturnedTotal || 18) * 10})
            </div>
          </div>
        </div>

        {/* Passbook / Transaction Log */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E6DEC9',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Passbook &amp; Transaction Activity
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#798C80' }}>
              Showing {transactions.length} latest entries
            </span>
          </div>

          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#798C80' }}>
              <Receipt size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No transaction history recorded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map((tx) => {
                const isCredit = tx.type === 'credit';

                return (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #EFE8D8',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: isCredit ? '#E8F5EE' : '#FDE8E4',
                        color: isCredit ? '#196D3D' : '#B2341A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#183626' }}>
                          {tx.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#798C80', marginTop: '2px' }}>
                          {tx.description} • {tx.date}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.05rem',
                        fontWeight: '800',
                        color: isCredit ? '#196D3D' : '#B2341A'
                      }}>
                        {isCredit ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#798C80' }}>
                        Bal: ₹{tx.balanceAfter}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Add Money */}
        {isAddMoneyOpen && (
          <div className="modal-backdrop" onClick={() => setIsAddMoneyOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
              <form onSubmit={handleAddFunds} style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FDF6E9', color: '#A26D24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
                      Add Funds to Wallet
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Current Balance: ₹{user?.walletBalance || 0}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
                    Select Preset Top-Up Amount
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[500, 1000, 2000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setSelectedPreset(amt); setCustomAmount(''); }}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: (!customAmount && selectedPreset === amt) ? '2px solid #183626' : '1px solid #E6DEC9',
                          backgroundColor: (!customAmount && selectedPreset === amt) ? '#FAF5EE' : '#FFFFFF',
                          color: '#183626',
                          fontSize: '1.05rem',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                    Or Enter Custom Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="10000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #E6DEC9', fontSize: '1rem', fontWeight: '600' }}
                  />
                </div>

                {/* Simulated Payment Mode */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                    Simulated Payment Method
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['UPI', 'Card', 'Netbanking'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: paymentMode === mode ? '700' : '500',
                          border: paymentMode === mode ? '1.5px solid #183626' : '1px solid #E6DEC9',
                          backgroundColor: paymentMode === mode ? '#FAF5EE' : '#FFFFFF',
                          color: '#183626',
                          cursor: 'pointer'
                        }}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Simulate Payment (₹{customAmount || selectedPreset})
                  </button>
                  <button type="button" onClick={() => setIsAddMoneyOpen(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
