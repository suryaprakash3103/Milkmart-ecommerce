import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { 
  Truck, Clock, ChevronRight, X, ShieldCheck, 
  MapPin, CheckCircle2, ChevronUp, ChevronDown 
} from 'lucide-react';

export const LiveOrderTrackerPill = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if on the order detail page itself or checkout
  if (location.pathname.startsWith('/orders/') || location.pathname === '/checkout' || location.pathname === '/order-confirmation') {
    return null;
  }

  // Find most recent active order
  const activeOrder = (orders || []).find(o => 
    o.status !== 'Delivered' && o.status !== 'Cancelled'
  );

  if (!activeOrder || isDismissed) {
    return null;
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Confirmed': return 'Confirmed & Farm Batch Milked';
      case 'Preparing': return 'Chilled at 3.6°C in Thermal Pouch';
      case 'Out for Delivery': return 'Out for Sunrise Delivery';
      default: return status;
    }
  };

  const getProgressPercent = (status) => {
    switch (status) {
      case 'Confirmed': return 35;
      case 'Preparing': return 65;
      case 'Out for Delivery': return 90;
      default: return 50;
    }
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '10px 16px',
          borderRadius: '30px',
          boxShadow: '0 8px 24px rgba(24, 54, 38, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          zIndex: 990,
          border: '1.5px solid #E8C582'
        }}
      >
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          boxShadow: '0 0 10px #25D366',
          animation: 'pulse 1.5s infinite'
        }} />
        <Truck size={18} color="#E8C582" />
        <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>
          #{activeOrder.id} • {activeOrder.status}
        </span>
        <ChevronUp size={16} color="#E8C582" />
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      maxWidth: '380px',
      width: 'calc(100% - 48px)',
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1.5px solid #E6DEC9',
      boxShadow: '0 12px 36px rgba(24, 54, 38, 0.16)',
      zIndex: 990,
      overflow: 'hidden'
    }}>
      {/* Top Beacon Header */}
      <div style={{
        backgroundColor: '#183626',
        color: '#FAF7F2',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            boxShadow: '0 0 8px #25D366'
          }} />
          <span style={{ fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#E8C582' }}>
            Swiggy-Style Live Tracking
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize"
            style={{ background: 'none', border: 'none', color: '#FAF7F2', cursor: 'pointer', padding: '2px', display: 'flex' }}
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            title="Dismiss"
            style={{ background: 'none', border: 'none', color: '#CBD5CB', cursor: 'pointer', padding: '2px', display: 'flex' }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#183626' }}>
              Order #{activeOrder.id}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#196D3D', fontWeight: '700', marginTop: '2px' }}>
              {getStatusText(activeOrder.status)}
            </div>
          </div>
          <span style={{
            backgroundColor: '#FAF5EE',
            color: '#8E5A17',
            border: '1px solid #E6DEC9',
            fontSize: '0.72rem',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            3.6°C Cold-Chain
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div style={{
          height: '6px',
          backgroundColor: '#FAF5EE',
          borderRadius: '4px',
          overflow: 'hidden',
          margin: '10px 0 12px 0',
          border: '1px solid #E6DEC9'
        }}>
          <div style={{
            height: '100%',
            width: `${getProgressPercent(activeOrder.status)}%`,
            backgroundColor: '#196D3D',
            borderRadius: '4px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#55685C', marginBottom: '14px' }}>
          <span>Partner: <strong>{activeOrder.deliveryPartner?.name || 'Ramesh Kumar'}</strong></span>
          <span>Window: <strong>5:30 – 7:30 AM</strong></span>
        </div>

        <button
          onClick={() => navigate(`/orders/${activeOrder.id}`)}
          className="btn btn-primary btn-sm"
          style={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '0.82rem',
            padding: '8px',
            borderRadius: '10px'
          }}
        >
          <Truck size={15} /> Open Live GPS &amp; Dispatch Timeline <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
