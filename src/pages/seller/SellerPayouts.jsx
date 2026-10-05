import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store } from '../../data/store';
import { useToast } from '../../context/ToastContext';
import { 
  Wallet, ArrowUpRight, CheckCircle2, Building, 
  CreditCard, Calendar, Sliders, Sparkles, X, 
  Download, ArrowRight, ShieldCheck 
} from 'lucide-react';

export const SellerPayouts = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [payouts, setPayouts] = useState(() => Store.getSellerPayouts(user?.id));
  const [balance, setBalance] = useState(user?.walletBalance || 24500);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('10000');
  const [isProcessing, setIsProcessing] = useState(false);

  // Quality calculation simulation
  const [simFat, setSimFat] = useState(4.8);
  const [simSnf, setSimSnf] = useState(8.9);

  const calculatedRate = (42 + (simFat * 5.5) + (simSnf * 3.5) - 31.75).toFixed(2);

  const loadPayouts = () => {
    const list = Store.getSellerPayouts(user?.id);
    setPayouts(list);
    const session = Store.getSessionUser();
    if (session) {
      setBalance(session.walletBalance ?? 24500);
    }
  };

  useEffect(() => {
    loadPayouts();
    const handleSync = () => loadPayouts();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const numAmount = Number(withdrawAmount);
    if (!numAmount || numAmount <= 0) {
      showToast('Please enter a valid withdrawal amount', 'error');
      return;
    }
    if (numAmount > balance) {
      showToast('Withdrawal amount exceeds your available balance', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const payout = Store.requestSellerPayout(user?.id || 'usr-seller-01', numAmount);
      setIsProcessing(false);
      setIsWithdrawModalOpen(false);
      loadPayouts();
      showToast(`Settlement of ₹${numAmount.toLocaleString()} transferred via IMPS (Ref: ${payout.bankRef})`, 'success');
    }, 800);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
            MilkMart Direct Farm Settlement
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Procurement Payouts &amp; Bank Ledger
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
            Transparent daily milk procurement earnings computed by certified fat and SNF quality tests.
          </p>
        </div>

        <button 
          onClick={() => {
            setWithdrawAmount(Math.min(balance, 10000).toString());
            setIsWithdrawModalOpen(true);
          }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowUpRight size={16} /> Instant Bank Transfer
        </button>
      </div>

      {/* Main KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        marginBottom: '28px'
      }}>
        <div className="card-artisan" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', color: '#798C80', fontWeight: '600' }}>Available Settlement Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            ₹{balance.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#196D3D', marginTop: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Ready for instant NEFT / IMPS withdrawal
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', color: '#798C80', fontWeight: '600' }}>Total Liters Procured &amp; Paid</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            1,480 Liters
          </div>
          <div style={{ fontSize: '0.74rem', color: '#A26D24', marginTop: '4px', fontWeight: '600' }}>
            Avg realization: ₹68.00 per liter
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', color: '#798C80', fontWeight: '600' }}>Linked Bank Account</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <Building size={20} color="#183626" />
            <div>
              <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.92rem' }}>HDFC Bank Ltd.</div>
              <div style={{ fontSize: '0.74rem', color: '#798C80' }}>A/C: ••••4920 • Kengeri Branch</div>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#196D3D', marginTop: '6px', fontWeight: '700' }}>
            Verified FSSAI Farm Partner
          </div>
        </div>
      </div>

      {/* Interactive Quality Rate Formula Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid #E6DEC9',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#A26D24', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
              <Sliders size={14} /> Quality-Indexed Formula
            </div>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', color: '#183626', fontFamily: 'Fraunces, serif' }}>
              Dairy Cooperative Fat &amp; SNF Price Calculator
            </h3>
          </div>
          <div style={{
            backgroundColor: '#FEF8EB',
            color: '#A26D24',
            padding: '6px 14px',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '1.1rem',
            border: '1px solid rgba(162, 109, 36, 0.3)'
          }}>
            ₹{calculatedRate} / Liter Payout
          </div>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#55685C', marginTop: 0, marginBottom: '16px' }}>
          MilkMart rewards high nutrition standards. Use the sliders below to simulate how higher butterfat and solids-not-fat increase your doorstep farm gate earnings.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: '700', marginBottom: '6px' }}>
              <span style={{ color: '#183626' }}>Natural Butterfat %</span>
              <span style={{ color: '#A26D24' }}>{simFat}%</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="8.5"
              step="0.1"
              value={simFat}
              onChange={(e) => setSimFat(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#A26D24' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#798C80', marginTop: '2px' }}>
              <span>3.0% (Standard)</span>
              <span>8.5% (High Fat Buffalo)</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: '700', marginBottom: '6px' }}>
              <span style={{ color: '#183626' }}>SNF (Solids Not Fat) %</span>
              <span style={{ color: '#196D3D' }}>{simSnf}%</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="10.0"
              step="0.1"
              value={simSnf}
              onChange={(e) => setSimSnf(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#196D3D' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#798C80', marginTop: '2px' }}>
              <span>7.5%</span>
              <span>10.0% (Superior Density)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="card-artisan" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1.5px solid #E6DEC9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#183626', fontFamily: 'Fraunces, serif' }}>
            Settlement Ledger
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#798C80' }}>
            {payouts.length} Transactions
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1.5px solid #E6DEC9', color: '#183626' }}>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Date &amp; Ref No.</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Liters Procured</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Fat / Rate</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Amount Settled</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', textAlign: 'right' }}>Bank Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} style={{ borderBottom: '1px solid #F0EAE1' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '700', color: '#183626' }}>{payout.date}</div>
                    <div style={{ fontSize: '0.74rem', color: '#798C80' }}>{payout.bankRef}</div>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#183626', fontWeight: '600' }}>
                    {payout.litersPaid} Liters
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '600', color: '#183626' }}>₹{payout.ratePerLiter} / L</div>
                    <div style={{ fontSize: '0.74rem', color: '#A26D24' }}>{payout.avgFat}% Fat Avg</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#196D3D' }}>₹{payout.amount.toLocaleString()}</strong>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#E8F5EE',
                      color: '#196D3D',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.76rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={13} /> {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WITHDRAW MODAL */}
      {isWithdrawModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FAF7F2',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            border: '1.5px solid #E8C582',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 22px',
              backgroundColor: '#183626',
              color: '#FAF7F2',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Fraunces, serif' }}>
                  Instant Bank Settlement
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#E8C582' }}>IMPS / NEFT Direct Credit</div>
              </div>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FAF7F2', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWithdraw} style={{ padding: '22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', color: '#798C80' }}>Available to withdraw</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, serif' }}>
                  ₹{balance.toLocaleString()}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                  Transfer Amount (₹)
                </label>
                <input
                  type="number"
                  max={balance}
                  min={100}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '1rem',
                    fontWeight: '700',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #E6DEC9',
                marginBottom: '20px',
                fontSize: '0.8rem'
              }}>
                <div style={{ color: '#798C80', marginBottom: '2px' }}>Recipient Account:</div>
                <div style={{ fontWeight: '700', color: '#183626' }}>HDFC Bank • Account ending in ••••4920</div>
                <div style={{ color: '#196D3D', fontSize: '0.74rem', marginTop: '2px' }}>
                  ✓ Instant 24x7 IMPS Transfer (Zero fees)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="btn btn-outline-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isProcessing ? 'Processing Transfer...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
