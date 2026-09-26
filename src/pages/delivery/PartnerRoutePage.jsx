import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store } from '../../data/store';
import { useToast } from '../../context/ToastContext';
import { 
  Truck, CheckCircle, MapPin, Phone, RefreshCcw, 
  Camera, BellOff, Navigation, Clock, ShieldCheck, 
  Map, List, Check, ArrowLeft, AlertCircle, Sparkles 
} from 'lucide-react';

export const PartnerRoutePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  // Modal State
  const [activeStop, setActiveStop] = useState(null);
  const [bottlesCollected, setBottlesCollected] = useState(2);
  const [silentVerified, setSilentVerified] = useState(true);
  const [dropPhotoAttached, setDropPhotoAttached] = useState(false);
  const [driverNotes, setDriverNotes] = useState('Delivered quietly inside thermal pouch');

  const loadData = () => {
    const allOrders = Store.getUsers(); // sync check
    try {
      const savedOrders = JSON.parse(localStorage.getItem('milkmart_orders')) || [];
      setOrders(savedOrders);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, []);

  const pendingStops = orders.filter(o => o.status !== 'Delivered');
  const completedStops = orders.filter(o => o.status === 'Delivered');

  const displayedOrders = orders.filter(o => {
    if (filter === 'pending') return o.status !== 'Delivered';
    if (filter === 'completed') return o.status === 'Delivered';
    return true;
  });

  const handleOpenDropModal = (order) => {
    setActiveStop(order);
    setBottlesCollected(2);
    setSilentVerified(true);
    setDropPhotoAttached(false);
    setDriverNotes('Placed in doorstep insulated thermal bag');
  };

  const handleConfirmDrop = (e) => {
    e.preventDefault();
    if (!activeStop) return;

    Store.markDeliveryCompleted({
      orderId: activeStop.id,
      partnerUser: user,
      bottlesDelivered: activeStop.items.reduce((s, i) => s + i.quantity, 0),
      bottlesCollected: Number(bottlesCollected),
      photoUrl: dropPhotoAttached ? '/images/products/milk-a2.jpg' : null,
      notes: driverNotes,
      silentAcknowledged: silentVerified
    });

    showToast(`Stop #${activeStop.id} completed! +₹${bottlesCollected * 10} credited to customer.`);
    setActiveStop(null);
    loadData();
  };

  return (
    <div style={{ padding: '24px 0 70px 0', backgroundColor: '#FAF7F2', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Driver Shift Banner */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          borderRadius: '20px',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(24, 54, 38, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#5CD685', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5CD685' }}></span>
              Sunrise Delivery Shift: 5:30 AM – 7:30 AM (In Progress)
            </div>
            <h1 style={{ fontSize: '1.9rem', color: '#FAF7F2', margin: '2px 0 6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
              Fleet Doorstep Manifest
            </h1>
            <div style={{ fontSize: '0.86rem', color: '#CBD5CB' }}>
              Partner: <strong>{user?.name || 'Ramesh Kumar'}</strong> • {user?.route || 'Route 4B - HSR & Koramangala'} • Chilled EV (3.8°C)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/partner/bottles" className="btn btn-outline-light btn-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#E8C582' }}>
              <RefreshCcw size={14} /> Bottle Refund Log
            </Link>
            <Link to="/" className="btn btn-ghost btn-sm" style={{ color: '#FAF7F2' }}>
              Storefront
            </Link>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="card-artisan" style={{ padding: '18px' }}>
            <span style={{ fontSize: '0.78rem', color: '#798C80', fontWeight: '600' }}>Route Stops Remaining</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
              {pendingStops.length} of {orders.length}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#196D3D', marginTop: '2px' }}>
              {completedStops.length} Completed
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '18px' }}>
            <span style={{ fontSize: '0.78rem', color: '#798C80', fontWeight: '600' }}>Bottles to Drop Today</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
              {orders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0)} Bottles
            </div>
            <div style={{ fontSize: '0.74rem', color: '#0E587B', marginTop: '2px' }}>
              Insulated at 3.8°C
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '18px' }}>
            <span style={{ fontSize: '0.78rem', color: '#798C80', fontWeight: '600' }}>Empty Bottles Collected</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#196D3D', marginTop: '2px' }}>
              {orders.reduce((acc, o) => acc + (o.bottlesReturned || 0), 0)} Bottles
            </div>
            <div style={{ fontSize: '0.74rem', color: '#196D3D', marginTop: '2px' }}>
              ₹{orders.reduce((acc, o) => acc + (o.bottlesReturned || 0), 0) * 10} customer refunds
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '18px' }}>
            <span style={{ fontSize: '0.78rem', color: '#798C80', fontWeight: '600' }}>Sunrise Target</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#8E5A17', marginTop: '2px' }}>
              7:30 AM
            </div>
            <div style={{ fontSize: '0.74rem', color: '#8E5A17', marginTop: '2px' }}>
              Before household wakeups
            </div>
          </div>
        </div>

        {/* Navigation & View Toggle Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: filter === 'all' ? '700' : '500',
                backgroundColor: filter === 'all' ? '#183626' : '#FFFFFF',
                color: filter === 'all' ? '#FAF7F2' : '#55685C',
                border: '1px solid #E6DEC9',
                cursor: 'pointer'
              }}
            >
              All Stops ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: filter === 'pending' ? '700' : '500',
                backgroundColor: filter === 'pending' ? '#183626' : '#FFFFFF',
                color: filter === 'pending' ? '#FAF7F2' : '#55685C',
                border: '1px solid #E6DEC9',
                cursor: 'pointer'
              }}
            >
              Pending ({pendingStops.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: filter === 'completed' ? '700' : '500',
                backgroundColor: filter === 'completed' ? '#183626' : '#FFFFFF',
                color: filter === 'completed' ? '#FAF7F2' : '#55685C',
                border: '1px solid #E6DEC9',
                cursor: 'pointer'
              }}
            >
              Completed ({completedStops.length})
            </button>
          </div>

          {/* List / Map View Switcher */}
          <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E6DEC9', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#183626' : '#FFFFFF',
                color: viewMode === 'list' ? '#FAF7F2' : '#55685C',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <List size={14} /> Stop List
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                border: 'none',
                backgroundColor: viewMode === 'map' ? '#183626' : '#FFFFFF',
                color: viewMode === 'map' ? '#FAF7F2' : '#55685C',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Map size={14} /> Route Map View
            </button>
          </div>
        </div>

        {/* MAP VIEW SIMULATION */}
        {viewMode === 'map' ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E6DEC9',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#183626' }}>
                  Live Route Simulation: Route 4B
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#798C80' }}>
                  Optimized for silence and minimum transit time (Total: 4.8 km)
                </span>
              </div>
              <span style={{ backgroundColor: '#E8F5EE', color: '#196D3D', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700' }}>
                GPS Telemetry Online
              </span>
            </div>

            {/* Simulated Interactive Map Canvas */}
            <div style={{
              width: '100%',
              height: '340px',
              backgroundColor: '#FAF5EE',
              borderRadius: '14px',
              border: '1px solid #E6DEC9',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* SVG Map Path Graphic */}
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Simulated Roads */}
                <path d="M 40,80 Q 200,60 380,120 T 700,100 T 900,220" fill="none" stroke="#E6DEC9" strokeWidth="12" />
                <path d="M 120,280 Q 300,220 500,260 T 850,280" fill="none" stroke="#E6DEC9" strokeWidth="10" />
                <path d="M 220,40 L 260,300" fill="none" stroke="#E6DEC9" strokeWidth="8" />
                <path d="M 520,30 L 510,320" fill="none" stroke="#E6DEC9" strokeWidth="8" />

                {/* Route Track in Green */}
                <path
                  d="M 80,120 Q 240,110 380,120 T 600,160 T 820,220"
                  fill="none"
                  stroke="#183626"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                />
              </svg>

              {/* Waypoint 1 */}
              <div style={{
                position: 'absolute',
                top: '100px',
                left: '70px',
                backgroundColor: '#196D3D',
                color: '#FAF7F2',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}>
                <CheckCircle size={14} /> Stop 1: Green Meadows (Completed)
              </div>

              {/* Waypoint 2 (Current) */}
              <div style={{
                position: 'absolute',
                top: '110px',
                left: '360px',
                backgroundColor: '#A26D24',
                color: '#FAF7F2',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 6px 16px rgba(162, 109, 36, 0.3)',
                animation: 'pulse 2s infinite'
              }}>
                <Navigation size={14} /> Stop 2: EcoGlen Palms (Next - 0.8 km)
              </div>

              {/* Waypoint 3 */}
              <div style={{
                position: 'absolute',
                top: '200px',
                left: '720px',
                backgroundColor: '#183626',
                color: '#FAF7F2',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}>
                <MapPin size={14} /> Stop 3: Sector 3 Villa (Pending)
              </div>
            </div>
          </div>
        ) : null}

        {/* STOP CARDS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedOrders.map((order, idx) => {
            const isDelivered = order.status === 'Delivered';

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: isDelivered ? '1.5px solid #E8F5EE' : '1.5px solid #E6DEC9',
                  padding: '24px',
                  boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)',
                  position: 'relative'
                }}
              >
                {/* Stop Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      backgroundColor: isDelivered ? '#196D3D' : '#183626',
                      color: '#FAF7F2',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      fontWeight: '800'
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: '#183626' }}>
                        Stop #{order.id} — {order.deliveryAddress?.name}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: '#798C80' }}>
                        Time Window: {order.timeSlot}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    backgroundColor: isDelivered ? '#E8F5EE' : '#FDF4E3',
                    color: isDelivered ? '#196D3D' : '#8E5A17'
                  }}>
                    {isDelivered ? '✓ Delivered at Doorstep' : order.status}
                  </span>
                </div>

                {/* Address & Instructions */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '14px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.88rem', color: '#183626', marginBottom: '4px' }}>
                      <MapPin size={16} color="#183626" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{order.deliveryAddress?.house}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#798C80', marginLeft: '22px' }}>
                      <Phone size={13} /> {order.deliveryAddress?.phone}
                    </div>
                  </div>

                  {/* Special Silent Delivery Note */}
                  <div style={{
                    backgroundColor: '#FAF5EE',
                    border: '1px solid #E6DEC9',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    color: '#8E5A17',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <BellOff size={16} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Silent Delivery:</strong> {order.deliveryAddress?.dropInstruction || 'Leave in porch bag silently'}
                    </div>
                  </div>
                </div>

                {/* Items to Drop */}
                <div style={{
                  backgroundColor: '#FAF7F2',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '0.86rem', color: '#183626' }}>
                    <strong>Bottles to drop: </strong>
                    {order.items.map(i => `${i.quantity}x ${i.name} (${i.size})`).join(' + ')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0E587B', fontWeight: '700' }}>
                    Chilled in insulated van hold
                  </div>
                </div>

                {/* Action Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderTop: '1px solid #F1EDE3',
                  paddingTop: '14px'
                }}>
                  <div style={{ fontSize: '0.82rem', color: '#196D3D', fontWeight: '600' }}>
                    {order.bottlesReturned > 0 ? (
                      `✓ ${order.bottlesReturned} Empty Bottles Collected (+₹${order.bottlesReturned * 10} Credited)`
                    ) : (
                      'Check doorstep thermal pouch for returned empty bottles'
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!isDelivered ? (
                      <button
                        onClick={() => handleOpenDropModal(order)}
                        className="btn btn-primary btn-sm"
                      >
                        <Check size={14} /> Doorstep Drop &amp; Bottle Collection
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#196D3D', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={16} /> Completed at {order.deliveredAt || '06:15 AM'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DOORSTEP DROP & BOTTLE COLLECTION MODAL */}
        {activeStop && (
          <div className="modal-backdrop" onClick={() => setActiveStop(null)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <form onSubmit={handleConfirmDrop} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E8F5EE', color: '#196D3D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
                      Confirm Doorstep Drop
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#798C80' }}>
                      Stop #{activeStop.id} • Customer: {activeStop.deliveryAddress?.name}
                    </div>
                  </div>
                </div>

                {/* Step 1: Bottles Dropped Info */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '0.84rem' }}>
                  <span style={{ fontWeight: '700', color: '#183626' }}>Dropping fresh milk: </span>
                  {activeStop.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                {/* Step 2: Empty Bottles Collected */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: '700', color: '#183626' }}>
                      Empty Bottles Collected from Pouch
                    </label>
                    <span style={{ fontSize: '0.78rem', color: '#196D3D', fontWeight: '700' }}>
                      +₹{bottlesCollected * 10} wallet credit
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[0, 1, 2, 3, 4, 5].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setBottlesCollected(count)}
                        style={{
                          flex: 1,
                          padding: '10px 4px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          border: bottlesCollected === count ? '2px solid #183626' : '1px solid #E6DEC9',
                          backgroundColor: bottlesCollected === count ? '#FAF5EE' : '#FFFFFF',
                          color: '#183626',
                          cursor: 'pointer'
                        }}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Photo Placeholder */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                    Doorstep Drop Photo (Optional Verification)
                  </label>
                  <button
                    type="button"
                    onClick={() => setDropPhotoAttached(!dropPhotoAttached)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: dropPhotoAttached ? '1.5px solid #196D3D' : '1.5px dashed #E6DEC9',
                      backgroundColor: dropPhotoAttached ? '#E8F5EE' : '#FAF5EE',
                      color: dropPhotoAttached ? '#196D3D' : '#55685C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <Camera size={16} />
                    {dropPhotoAttached ? 'Doorstep Photo Attached ✓' : 'Take Doorstep Photo / Attach proof'}
                  </button>
                </div>

                {/* Step 4: Silent Delivery Acknowledgment */}
                <div style={{
                  backgroundColor: '#FAF5EE',
                  border: '1px solid #E6DEC9',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <input
                    type="checkbox"
                    id="silentCheck"
                    checked={silentVerified}
                    onChange={(e) => setSilentVerified(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#183626' }}
                  />
                  <label htmlFor="silentCheck" style={{ fontSize: '0.82rem', color: '#183626', fontWeight: '600', cursor: 'pointer' }}>
                    I confirm quiet delivery inside insulated pouch without ringing doorbell
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Complete Stop &amp; Credit ₹{bottlesCollected * 10}
                  </button>
                  <button type="button" onClick={() => setActiveStop(null)} className="btn btn-ghost">
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
