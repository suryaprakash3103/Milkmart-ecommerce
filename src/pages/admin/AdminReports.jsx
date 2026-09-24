import React from 'react';
import { BarChart3, TrendingUp, RefreshCcw, Droplets, Award } from 'lucide-react';

export const AdminReports = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
          Farm Volume &amp; Environmental Sustainability Reports
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
          Monthly liters consumed, single-use plastic pouches averted, and subscriber retention metrics
        </p>
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
