import React from 'react';
import { Truck, MapPin, CheckCircle, Clock } from 'lucide-react';

export const AdminDelivery = () => {
  const routes = [
    {
      id: "Route-4B",
      name: "HSR Layout & Koramangala",
      driver: "Ramesh Kumar",
      phone: "+91 98765 43210",
      vehicle: "KA01-EK-4501 (Chilled EV)",
      totalStops: 42,
      completedStops: 36,
      bottlesReturned: 52,
      status: "On Route (86% Completed)",
      dispatchTime: "5:30 AM"
    },
    {
      id: "Route-2A",
      name: "Indiranagar & Domlur",
      driver: "Suresh Gowda",
      phone: "+91 98451 99887",
      vehicle: "KA03-ME-1102 (Insulated Van)",
      totalStops: 38,
      completedStops: 38,
      bottlesReturned: 64,
      status: "Finished (100% Delivered)",
      dispatchTime: "5:20 AM"
    },
    {
      id: "Route-5C",
      name: "Bellandur & Whitefield",
      driver: "Anand Verma",
      phone: "+91 99123 44556",
      vehicle: "KA51-AB-7789 (Chilled EV)",
      totalStops: 45,
      completedStops: 31,
      bottlesReturned: 44,
      status: "On Route (69% Completed)",
      dispatchTime: "5:40 AM"
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
          Morning Delivery Fleet &amp; Route Telemetry
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
          Real-time tracking of refrigerated morning vans, stop completions, and bottle collection tallies
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
        {routes.map((r) => (
          <div
            key={r.id}
            className="card-artisan"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E6DEC9',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{
                backgroundColor: '#183626',
                color: '#FAF7F2',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: '700'
              }}>
                {r.id}
              </span>
              <span style={{
                fontSize: '0.76rem',
                fontWeight: '700',
                color: r.completedStops === r.totalStops ? '#196D3D' : '#8E5A17',
                backgroundColor: r.completedStops === r.totalStops ? '#E8F5EE' : '#FDF4E3',
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                {r.status}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#183626', margin: '0 0 6px 0' }}>
              {r.name}
            </h3>

            <div style={{ fontSize: '0.84rem', color: '#55685C', marginBottom: '14px' }}>
              <strong>Driver:</strong> {r.driver} • {r.phone}<br />
              <strong>Vehicle:</strong> {r.vehicle}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#798C80', marginBottom: '4px' }}>
                <span>Stops: {r.completedStops} / {r.totalStops}</span>
                <span>{Math.round((r.completedStops / r.totalStops) * 100)}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#E6DEC9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(r.completedStops / r.totalStops) * 100}%`,
                  height: '100%',
                  backgroundColor: '#183626'
                }} />
              </div>
            </div>

            <div style={{
              borderTop: '1px solid #F1EDE3',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: '#183626'
            }}>
              <span>Empty Bottles Collected: <strong>{r.bottlesReturned}</strong></span>
              <span>Dispatched: <strong>{r.dispatchTime}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
