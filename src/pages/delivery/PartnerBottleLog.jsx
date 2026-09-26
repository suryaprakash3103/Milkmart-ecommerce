import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../../data/store';
import { useAuth } from '../../context/AuthContext';
import { RefreshCcw, ArrowLeft, CheckCircle2, ShieldCheck, Truck, Sparkles, Filter } from 'lucide-react';

export const PartnerBottleLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    const all = Store.getBottleLogs();
    setLogs(all);
  };

  useEffect(() => {
    loadLogs();
    const handleSync = () => loadLogs();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, []);

  const totalCollected = logs.reduce((acc, l) => acc + (l.bottlesCollected || 0), 0);
  const totalRefunded = logs.reduce((acc, l) => acc + (l.creditGiven || 0), 0);

  return (
    <div style={{ padding: '24px 0 70px 0', backgroundColor: '#FAF7F2', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/partner" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', fontWeight: '600', color: '#183626' }}>
            <ArrowLeft size={16} /> Back to Doorstep Route Manifest
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Glass Bottle Return &amp; Deposit Log
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#55685C' }}>
              Real-time audit log of sanitized glass bottles retrieved from doorsteps and credited to customer wallets
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ backgroundColor: '#E8F5EE', color: '#196D3D', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700' }}>
              Circular Glass Deposit Active (+₹10/ea)
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div className="card-artisan" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Total Collected Today</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#196D3D', marginTop: '2px' }}>
              {totalCollected} Glass Bottles
            </div>
            <div style={{ fontSize: '0.76rem', color: '#55685C', marginTop: '2px' }}>
              Loaded in padded crates in vehicle hold
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Customer Refunds Disbursed</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
              ₹{totalRefunded}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#196D3D', marginTop: '2px' }}>
              Instant wallet credits applied
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Sanitization &amp; Re-use Loop</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#A26D24', marginTop: '2px' }}>
              100% Intact
            </div>
            <div style={{ fontSize: '0.76rem', color: '#798C80', marginTop: '2px' }}>
              0 broken bottles reported
            </div>
          </div>
        </div>

        {/* Table of Log Entries */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E6DEC9',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Doorstep Pickup History
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#798C80' }}>
              {logs.length} audit entries
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1EDE3', textAlign: 'left', color: '#798C80', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Date &amp; Time</th>
                  <th style={{ padding: '10px 12px' }}>Order ID</th>
                  <th style={{ padding: '10px 12px' }}>Customer &amp; Location</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Delivered</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Collected</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Refund Given</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #FAF5EE' }}>
                    <td style={{ padding: '12px', color: '#55685C', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '600', color: '#183626' }}>{log.date}</div>
                      <div style={{ fontSize: '0.76rem', color: '#798C80' }}>{log.time}</div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#183626' }}>
                      #{log.orderId}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#183626' }}>{log.customerName}</div>
                      <div style={{ fontSize: '0.76rem', color: '#798C80' }}>{log.customerAddress}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#183626' }}>
                      {log.bottlesDelivered || 2}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ backgroundColor: '#E8F5EE', color: '#196D3D', padding: '3px 8px', borderRadius: '8px', fontWeight: '700', fontSize: '0.84rem' }}>
                        {log.bottlesCollected} Bottles
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: '#196D3D' }}>
                      +₹{log.creditGiven}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.76rem', color: '#196D3D', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={13} /> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
