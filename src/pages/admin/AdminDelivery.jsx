import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle, Clock, Plus, Printer, Phone, ShieldCheck, X, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminDelivery = () => {
  const { showToast } = useToast();

  const [routes, setRoutes] = useState([
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
      dispatchTime: "5:30 AM",
      temperature: "3.8°C",
      stops: [
        { id: "S1", customer: "Surya Prakash", address: "Flat 402, Green Meadows, HSR Sector 4", items: "2x A2 Gir Cow Milk (1L), 1x Set Dahi", note: "Leave in insulated doorstep pouch" },
        { id: "S2", customer: "Priya Sharma", address: "Flat 402, Green Glen Palms, Bellandur", items: "1x A2 Gir Cow Milk (1L)", note: "Do not ring bell before 7 AM" },
        { id: "S3", customer: "Karan Malhotra", address: "Villa 12, Koramangala 3rd Block", items: "2x Buffalo Milk (1L), 1x Malai Paneer", note: "Handover at security gate" }
      ]
    },
    {
      id: "Route-2A",
      name: "Indiranagar & Domlur",
      driver: "Suresh Patil",
      phone: "+91 98112 34567",
      vehicle: "KA05-EV-8822 (Electric Loader)",
      totalStops: 38,
      completedStops: 38,
      bottlesReturned: 64,
      status: "Finished (100% Delivered)",
      dispatchTime: "5:20 AM",
      temperature: "3.6°C",
      stops: [
        { id: "S1", customer: "Deepa Nair", address: "100ft Road, Indiranagar", items: "1x A2 Cow Milk (1L)", note: "Leave on doorstep shoe rack" }
      ]
    },
    {
      id: "Route-5C",
      name: "Whitefield & ITPL",
      driver: "Anand Verma",
      phone: "+91 99123 44556",
      vehicle: "KA51-AB-7789 (Chilled EV)",
      totalStops: 45,
      completedStops: 31,
      bottlesReturned: 44,
      status: "On Route (69% Completed)",
      dispatchTime: "5:40 AM",
      temperature: "3.9°C",
      stops: [
        { id: "S1", customer: "Rohit Sen", address: "Prestige Ozone, Whitefield", items: "3x A2 Cow Milk (1L)", note: "Doorstep drop" }
      ]
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedRouteForManifest, setSelectedRouteForManifest] = useState(null);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerData, setNewPartnerData] = useState({
    routeId: 'Route-1A',
    routeName: 'Jayanagar & JP Nagar',
    driver: '',
    phone: '',
    vehicle: 'Electric Chilled Van (KA04-EV-3311)',
    dispatchTime: '5:30 AM'
  });

  const handleAddPartner = (e) => {
    e.preventDefault();
    const newRoute = {
      id: newPartnerData.routeId,
      name: newPartnerData.routeName,
      driver: newPartnerData.driver,
      phone: newPartnerData.phone,
      vehicle: newPartnerData.vehicle,
      totalStops: 30,
      completedStops: 0,
      bottlesReturned: 0,
      status: 'Assigned (Pending Sunrise Dispatch)',
      dispatchTime: newPartnerData.dispatchTime,
      temperature: '3.8°C',
      stops: [
        { id: "S1", customer: "New Subscriber", address: "Doorstep, Bengaluru", items: "1x A2 Gir Cow Milk (1L)", note: "Leave in thermal bag" }
      ]
    };
    setRoutes([newRoute, ...routes]);
    showToast(`Assigned ${newPartnerData.driver} to ${newPartnerData.routeId}!`);
    setIsAddPartnerOpen(false);
  };

  const filteredRoutes = routes.filter(r => {
    if (filter === 'active') return r.completedStops < r.totalStops;
    if (filter === 'completed') return r.completedStops === r.totalStops;
    return true;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Morning Delivery Fleet &amp; Route Telemetry
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
            Real-time tracking of refrigerated morning vans, stop completions, and bottle collection tallies
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setSelectedRouteForManifest(routes[0])}
            className="btn btn-outline-dark"
          >
            <Printer size={16} /> Export Route Manifest
          </button>
          <button
            onClick={() => setIsAddPartnerOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={16} /> Assign New Partner
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: filter === f ? '700' : '500',
              backgroundColor: filter === f ? '#183626' : '#FFFFFF',
              color: filter === f ? '#FAF7F2' : '#55685C',
              border: '1px solid #E6DEC9',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {f === 'all' ? `All Fleet (${routes.length})` : f === 'active' ? 'Active On-Route' : 'Completed Runs'}
          </button>
        ))}
      </div>

      {/* Routes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
        {filteredRoutes.map((r) => (
          <div
            key={r.id}
            className="card-artisan"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid #E6DEC9',
              padding: '24px',
              boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
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

            <h3 style={{ fontSize: '1.25rem', color: '#183626', margin: '0 0 6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
              {r.name}
            </h3>

            <div style={{ fontSize: '0.84rem', color: '#55685C', marginBottom: '14px', lineHeight: 1.5 }}>
              <strong>Driver:</strong> {r.driver} • {r.phone}<br />
              <strong>Vehicle:</strong> {r.vehicle} • Hold Temp: <strong>{r.temperature}</strong>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#798C80', marginBottom: '4px' }}>
                <span>Doorstep Drops: {r.completedStops} / {r.totalStops}</span>
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
              alignItems: 'center',
              fontSize: '0.82rem',
              color: '#183626'
            }}>
              <span>Empty Bottles Collected: <strong style={{ color: '#196D3D' }}>{r.bottlesReturned}</strong></span>
              <button
                onClick={() => setSelectedRouteForManifest(r)}
                style={{ color: '#A26D24', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <FileText size={13} /> View Manifest
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Printable Route Manifest */}
      {selectedRouteForManifest && (
        <div className="modal-backdrop" onClick={() => setSelectedRouteForManifest(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ padding: '28px' }}>
              {/* Manifest Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #183626', paddingBottom: '16px', marginBottom: '18px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#8E5A17', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    MilkMart Morning Fleet Manifest
                  </div>
                  <h2 style={{ fontSize: '1.4rem', color: '#183626', margin: '4px 0 0 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                    {selectedRouteForManifest.id} — {selectedRouteForManifest.name}
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: '#55685C', marginTop: '2px' }}>
                    Shift: 5:30 AM – 7:30 AM Sunrise Run • Vehicle: {selectedRouteForManifest.vehicle}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRouteForManifest(null)}
                  style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <X size={20} color="#183626" />
                </button>
              </div>

              {/* Driver & Cold Chain Box */}
              <div style={{ backgroundColor: '#FAF5EE', border: '1px solid #E6DEC9', borderRadius: '10px', padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.82rem', marginBottom: '18px' }}>
                <div>
                  <span style={{ color: '#798C80' }}>Delivery Partner:</span>
                  <div style={{ fontWeight: '700', color: '#183626' }}>{selectedRouteForManifest.driver}</div>
                </div>
                <div>
                  <span style={{ color: '#798C80' }}>Contact Phone:</span>
                  <div style={{ fontWeight: '700', color: '#183626' }}>{selectedRouteForManifest.phone}</div>
                </div>
                <div>
                  <span style={{ color: '#798C80' }}>Hold Temperature:</span>
                  <div style={{ fontWeight: '700', color: '#0E587B' }}>{selectedRouteForManifest.temperature} (Insulated)</div>
                </div>
              </div>

              {/* Stop by Stop Table */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginBottom: '8px' }}>
                  Doorstep Stop Manifest ({selectedRouteForManifest.stops?.length || 3} Stops Listed)
                </div>
                <div style={{ border: '1px solid #E6DEC9', borderRadius: '10px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E6DEC9', color: '#798C80' }}>
                        <th style={{ padding: '8px 10px' }}>#</th>
                        <th style={{ padding: '8px 10px' }}>Customer &amp; Address</th>
                        <th style={{ padding: '8px 10px' }}>Milk Bottles to Drop</th>
                        <th style={{ padding: '8px 10px' }}>Silent Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedRouteForManifest.stops || []).map((stop, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1EDE3' }}>
                          <td style={{ padding: '8px 10px', fontWeight: '700' }}>{idx + 1}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ fontWeight: '600', color: '#183626' }}>{stop.customer}</div>
                            <div style={{ fontSize: '0.74rem', color: '#798C80' }}>{stop.address}</div>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#183626' }}>{stop.items}</td>
                          <td style={{ padding: '8px 10px', color: '#8E5A17', fontStyle: 'italic' }}>{stop.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    showToast("Opening print dialog for route manifest...");
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Printer size={16} /> Print Official Manifest
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRouteForManifest(null)}
                  className="btn btn-ghost"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Assign New Partner */}
      {isAddPartnerOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddPartnerOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <form onSubmit={handleAddPartner} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
                  Assign Fleet Delivery Partner
                </h3>
                <button type="button" onClick={() => setIsAddPartnerOpen(false)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                  <X size={20} color="#183626" />
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Driver Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Murthy"
                  value={newPartnerData.driver}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, driver: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Mobile Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 XXXXX"
                  value={newPartnerData.phone}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, phone: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Route ID</label>
                  <input
                    type="text"
                    required
                    value={newPartnerData.routeId}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, routeId: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Assigned Sector</label>
                  <input
                    type="text"
                    required
                    value={newPartnerData.routeName}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, routeName: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Chilled Vehicle Spec</label>
                <input
                  type="text"
                  required
                  value={newPartnerData.vehicle}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, vehicle: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Assign to Fleet
                </button>
                <button type="button" onClick={() => setIsAddPartnerOpen(false)} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
