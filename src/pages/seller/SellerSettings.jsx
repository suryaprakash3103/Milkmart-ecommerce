import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  Settings, Building2, CreditCard, Bell, 
  ShieldCheck, Save, Clock, MapPin, Truck, 
  CheckCircle2, RefreshCw 
} from 'lucide-react';

export const SellerSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    morningCutoff: '05:00 AM',
    eveningCutoff: '04:30 PM',
    deliveryRadiusKm: 25,
    minimumOrderAmount: 99,
    autoAcceptOrders: true,
    bottleDepositRefundable: true,
    
    // Bank payout account
    bankName: 'HDFC Bank Ltd',
    accountHolder: user?.name || 'Devendra Patel',
    accountNumber: '50100293847162',
    ifscCode: 'HDFC0001245',
    upiId: 'girfarm@okaxis',

    // Notifications
    smsOrderAlerts: true,
    emailDailyReport: true,
    lowStockPush: true
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`milkmart_seller_settings_${user?.id}`);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [user?.id]);

  const handleChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(`milkmart_seller_settings_${user?.id}`, JSON.stringify(settings));
        showToast('Farm dispatch and payout settings saved!', 'success');
      } catch (e) {
        showToast('Error saving settings', 'error');
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
          Operational Preferences
        </div>
        <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
          Producer &amp; Dispatch Settings
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
          Configure doorstep delivery cutoffs, linked bank accounts for weekly direct deposits, and auto-dispatch rules.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Operations & Cutoff Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#A26D24" /> Dispatch Logistics &amp; Cutoffs
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Morning Harvest Cutoff
                </label>
                <input
                  type="text"
                  value={settings.morningCutoff}
                  onChange={(e) => handleChange('morningCutoff', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Evening Milking Cutoff
                </label>
                <input
                  type="text"
                  value={settings.eveningCutoff}
                  onChange={(e) => handleChange('eveningCutoff', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Coverage Radius (km)
                </label>
                <input
                  type="number"
                  value={settings.deliveryRadiusKm}
                  onChange={(e) => handleChange('deliveryRadiusKm', Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Min Order Value (₹)
                </label>
                <input
                  type="number"
                  value={settings.minimumOrderAmount}
                  onChange={(e) => handleChange('minimumOrderAmount', Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: '#183626', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.autoAcceptOrders}
                  onChange={(e) => handleChange('autoAcceptOrders', e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#183626' }}
                />
                Auto-accept confirmed subscriptions without manual button click
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: '#183626', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.bottleDepositRefundable}
                  onChange={(e) => handleChange('bottleDepositRefundable', e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#183626' }}
                />
                Enable MilkMart Circular Returnable Glass Bottle Passbook
              </label>
            </div>
          </div>

          {/* Linked Bank Account for Payouts */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="#A26D24" /> Bank Account for Direct Payouts
            </h2>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Bank Name
              </label>
              <input
                type="text"
                value={settings.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.9rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Account Holder Name
              </label>
              <input
                type="text"
                value={settings.accountHolder}
                onChange={(e) => handleChange('accountHolder', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.9rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Account Number
                </label>
                <input
                  type="text"
                  value={settings.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={settings.ifscCode}
                  onChange={(e) => handleChange('ifscCode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D5CBBB',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Instant UPI ID
              </label>
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) => handleChange('upiId', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D5CBBB',
                  fontSize: '0.9rem',
                  color: '#183626',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>
          </div>

          {/* Notifications Preferences */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)',
            gridColumn: '1 / -1'
          }}>
            <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#A26D24" /> Alerts &amp; Notification Preferences
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#183626', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.smsOrderAlerts}
                  onChange={(e) => handleChange('smsOrderAlerts', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#183626' }}
                />
                SMS alerts when orders arrive before 5:00 AM
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#183626', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailDailyReport}
                  onChange={(e) => handleChange('emailDailyReport', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#183626' }}
                />
                Daily email reconciliation statement &amp; payout breakdown
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#183626', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.lowStockPush}
                  onChange={(e) => handleChange('lowStockPush', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#183626' }}
                />
                Push alerts when available stock dips below safety threshold
              </label>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 32px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#183626',
              color: '#FAF7F2',
              fontSize: '0.96rem',
              fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(24, 54, 38, 0.25)'
            }}
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin" size={18} /> Saving Settings...
              </>
            ) : (
              <>
                <Save size={18} color="#E8C582" /> Save Operational Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
