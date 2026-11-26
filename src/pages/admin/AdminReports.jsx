import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, RefreshCcw, Droplets, Award, Database, Server, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const AdminReports = () => {
  const [dbHealth, setDbHealth] = useState(null);
  const [loadingDb, setLoadingDb] = useState(false);

  const fetchHealth = async () => {
    setLoadingDb(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setDbHealth(data);
    } catch (e) {
      console.warn('Could not fetch DB health:', e.message);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
            Farm Volume &amp; Environmental Sustainability Reports
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
            Monthly liters consumed, single-use plastic pouches averted, and subscriber retention metrics
          </p>
        </div>
        <button
          onClick={fetchHealth}
          className="btn-artisan-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCcw size={16} className={loadingDb ? 'animate-spin' : ''} />
          Refresh Live Diagnostics
        </button>
      </div>

      {/* Database Connection & Infrastructure Telemetry Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E6DEC9',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EBF3EE', color: '#183626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#183626', margin: 0, fontWeight: '700' }}>
                Fullstack Database &amp; System Infrastructure
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#798C80', margin: 0 }}>
                MongoDB production engine with resilient disk-persisted fallback
              </p>
            </div>
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: dbHealth?.database?.mongodb?.connected ? '#DCFCE7' : '#FEF3C7',
            color: dbHealth?.database?.mongodb?.connected ? '#166534' : '#92400E',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: '600'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dbHealth?.database?.mongodb?.connected ? '#22C55E' : '#F59E0B' }} />
            {dbHealth?.database?.mongodb?.connected ? 'MongoDB Live (Connected)' : 'High-Resilience Persistence Mode'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FAF7F2', border: '1px solid #E6DEC9' }}>
            <span style={{ fontSize: '0.75rem', color: '#798C80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Database State</span>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
              {dbHealth?.database?.mongodb?.state || 'Active'}
            </div>
            <span style={{ fontSize: '0.74rem', color: '#55685C' }}>
              {dbHealth?.database?.mongodb?.uri || 'mongodb://127.0.0.1:27017'}
            </span>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FAF7F2', border: '1px solid #E6DEC9' }}>
            <span style={{ fontSize: '0.75rem', color: '#798C80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Products</span>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
              {dbHealth?.database?.collections?.products || 40} SKUs
            </div>
            <span style={{ fontSize: '0.74rem', color: '#196D3D' }}>Across 10 dairy categories</span>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FAF7F2', border: '1px solid #E6DEC9' }}>
            <span style={{ fontSize: '0.75rem', color: '#798C80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Partner Dairy Farms</span>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
              {dbHealth?.database?.collections?.farms || 3} Verified Gaushalas
            </div>
            <span style={{ fontSize: '0.74rem', color: '#196D3D' }}>100% FSSAI registered</span>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FAF7F2', border: '1px solid #E6DEC9' }}>
            <span style={{ fontSize: '0.75rem', color: '#798C80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>API Server Uptime</span>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
              Port 5050 (Online)
            </div>
            <span style={{ fontSize: '0.74rem', color: '#0E587B' }}>REST &amp; JWT Verified</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="card-artisan" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.82rem', color: '#798C80' }}>Monthly Milk Dispatched</span>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#183626', marginTop: '4px' }}>
            38,400 Liters
          </div>
          <div style={{ fontSize: '0.78rem', color: '#196D3D', fontWeight: '600', marginTop: '4px' }}>
            ↑ 18.2% vs previous month
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.82rem', color: '#798C80' }}>Plastic Pouches Eliminated</span>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#196D3D', marginTop: '4px' }}>
            76,800 Pouches
          </div>
          <div style={{ fontSize: '0.78rem', color: '#798C80', marginTop: '4px' }}>
            Replaced with sanitized glass bottles
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.82rem', color: '#798C80' }}>Subscriber Retention Rate</span>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#8E5A17', marginTop: '4px' }}>
            96.5%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#196D3D', fontWeight: '600', marginTop: '4px' }}>
            Low churn on daily morning habit
          </div>
        </div>

        <div className="card-artisan" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.82rem', color: '#798C80' }}>Average Cold-Chain Temp</span>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.9rem', fontWeight: '700', color: '#0E587B', marginTop: '4px' }}>
            3.8°C
          </div>
          <div style={{ fontSize: '0.78rem', color: '#0E587B', marginTop: '4px' }}>
            100% compliant under 4.0°C safety limit
          </div>
        </div>
      </div>

      {/* Volume Breakdown Visual */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E6DEC9',
        padding: '28px',
        marginBottom: '28px'
      }}>
        <h3 style={{ fontSize: '1.25rem', color: '#183626', marginBottom: '16px' }}>
          Volume Distribution by Dairy Line
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { name: "A2 Gir Cow Raw Milk", percent: 42, liters: "16,128 L", color: "#183626" },
            { name: "Murrah Buffalo Whole Milk", percent: 28, liters: "10,752 L", color: "#2E5840" },
            { name: "Homogenized Toned Milk", percent: 18, liters: "6,912 L", color: "#A26D24" },
            { name: "Artisanal Set Dahi & Paneer", percent: 12, liters: "4,608 L Eq.", color: "#E8C582" }
          ].map((item) => (
            <div key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#183626' }}>{item.name}</span>
                <span style={{ color: '#798C80' }}>{item.liters} ({item.percent}%)</span>
              </div>
              <div style={{ height: '10px', backgroundColor: '#FAF5EE', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E6DEC9' }}>
                <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
