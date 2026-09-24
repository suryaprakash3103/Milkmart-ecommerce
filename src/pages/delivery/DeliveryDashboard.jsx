import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Truck, CheckCircle2, Clock, MapPin, 
  RefreshCcw, ArrowRight, ShieldCheck, ArrowLeft 
} from 'lucide-react';

export const DeliveryDashboard = () => {
  const { orders } = useOrders();
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const assignedOrders = orders; // Route 4B stops
  const completedOrders = orders.filter((o) => o.status === 'Delivered');
  const pendingOrders = orders.filter((o) => o.status !== 'Delivered');

  const totalBottlesToDeliver = orders.reduce(
    (acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const totalBottlesCollected = orders.reduce(
    (acc, o) => acc + (o.bottlesReturned || 0),
    0
  );

  return (
    <div style={{ padding: '24px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Top Driver Switcher Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
              Sunrise Shift: 5:30 AM – 7:30 AM
            </div>
            <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
              Morning Delivery Fleet Portal
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
              Ramesh Kumar • <strong>Route 4B (HSR Layout &amp; Koramangala)</strong> • KA01-EK-4501
            </p>
          </div>

          <button
            onClick={() => {
              switchRole('customer');
              navigate('/');
            }}
            className="btn btn-outline-dark btn-sm"
          >
            <ArrowLeft size={14} /> Back to Customer Store
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div className="card-artisan" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#798C80' }}>Total Doorstep Stops</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#183626', marginTop: '4px' }}>
              {assignedOrders.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#183626', marginTop: '2px' }}>
              {completedOrders.length} Completed • {pendingOrders.length} Remaining
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#798C80' }}>Glass Bottles to Deliver</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#183626', marginTop: '4px' }}>
              {totalBottlesToDeliver} Bottles
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0E587B', marginTop: '2px' }}>
              Chilled in insulated EV hold (3.8°C)
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#798C80' }}>Empty Bottles Collected</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#196D3D', marginTop: '4px' }}>
              {totalBottlesCollected} Bottles
            </div>
            <div style={{ fontSize: '0.78rem', color: '#196D3D', marginTop: '2px' }}>
              ₹{totalBottlesCollected * 10} credited to customers
            </div>
          </div>

          <div className="card-artisan" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#798C80' }}>Shift Deadline</span>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#8E5A17', marginTop: '4px' }}>
              7:30 AM
            </div>
            <div style={{ fontSize: '0.78rem', color: '#8E5A17', marginTop: '2px' }}>
              Before sunrise doorstep drop
            </div>
          </div>
        </div>

        {/* Quick CTA */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          borderRadius: '18px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FAF7F2', margin: '0 0 4px 0' }}>
              Ready for Next Doorstep Stop?
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#CBD5CB' }}>
              Follow quiet drop guidelines. Check insulated porch bags and collect empty glass bottles.
            </p>
          </div>

          <Link to="/delivery/orders" className="btn btn-primary btn-lg">
            <Truck size={18} /> View Doorstep Run Manifest ({pendingOrders.length} Pending)
          </Link>
        </div>
      </div>
    </div>
  );
};
