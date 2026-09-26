import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { useToast } from '../../context/ToastContext';
import { 
  Sunrise, Calendar, Wallet, Package, ArrowRight, 
  Pause, PlusCircle, CheckCircle2, RefreshCcw, MapPin, 
  Sparkles, Clock, AlertCircle, Award 
} from 'lucide-react';
import { WalletIcon } from '../../components/common/WalletIcon';

export const CustomerDashboard = ({ onOpenWallet }) => {
  const { user, addWalletBalance } = useAuth();
  const { orders } = useOrders();
  const { subscriptions, pauseSubscription, resumeSubscription } = useSubscriptions();
  const { showToast } = useToast();

  const [isTomorrowPaused, setIsTomorrowPaused] = useState(false);
  const [extraMilkAdded, setExtraMilkAdded] = useState(false);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'Active');
  const latestOrder = orders[0];

  const handlePauseTomorrow = () => {
    setIsTomorrowPaused(!isTomorrowPaused);
    if (!isTomorrowPaused) {
      showToast("Tomorrow morning's milk delivery has been paused. No charge applied!");
    } else {
      showToast("Tomorrow morning's milk delivery resumed!");
    }
  };

  const handleAddExtraBottle = () => {
    setExtraMilkAdded(true);
    showToast("Added 1 Extra Bottle of A2 Gir Cow Milk (+₹76.50) to tomorrow's sunrise run!");
  };

  return (
    <div style={{ padding: '36px 0 70px 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Welcome & Persona Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#E8F5EE',
              color: '#196D3D',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '700',
              marginBottom: '6px'
            }}>
              <Sunrise size={14} /> Morning Sunrise Fleet • Active Subscriber
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Good Morning, {user?.name?.split(' ')[0] || 'Member'}!
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#55685C' }}>
              Your fresh daily raw milk is bottled and chilling at 3.8°C for tomorrow's run.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/account/wallet" className="btn btn-outline-dark btn-sm">
              <Wallet size={15} /> Wallet: ₹{user?.walletBalance || 0}
            </Link>
            <Link to="/products" className="btn btn-primary btn-sm">
              Explore Storefront <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Portal Quick Navigation Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px'
        }}>
          <Link to="/account" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#183626', color: '#FAF7F2', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}>
            Overview
          </Link>
          <Link to="/account/subscriptions" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#FFFFFF', color: '#183626', border: '1px solid #E6DEC9', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' }}>
            Subscriptions ({activeSubscriptions.length})
          </Link>
          <Link to="/account/orders" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#FFFFFF', color: '#183626', border: '1px solid #E6DEC9', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' }}>
            Orders ({orders.length})
          </Link>
          <Link to="/account/wallet" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#FFFFFF', color: '#183626', border: '1px solid #E6DEC9', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' }}>
            Wallet &amp; Refunds
          </Link>
          <Link to="/account/addresses" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#FFFFFF', color: '#183626', border: '1px solid #E6DEC9', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' }}>
            Addresses
          </Link>
          <Link to="/account/profile" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#FFFFFF', color: '#183626', border: '1px solid #E6DEC9', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' }}>
            Profile Settings
          </Link>
        </div>

        {/* Hero Card: Upcoming Sunrise Delivery Countdown & Status */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          borderRadius: '22px',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: '0 8px 30px rgba(24, 54, 38, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E8C582', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                <Clock size={16} /> Next Doorstep Delivery
              </div>
              <h2 style={{ fontSize: '1.8rem', color: '#FAF7F2', margin: '0 0 8px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                {isTomorrowPaused ? "Tomorrow's Run is Paused" : "Tomorrow Morning: 5:30 AM – 7:30 AM"}
              </h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#CBD5CB' }}>
                {isTomorrowPaused ? (
                  "You have paused delivery for tomorrow. Deliveries will resume normally the day after."
                ) : (
                  "Driver Ramesh Kumar (Route 4B) will drop your fresh bottles into your thermal doorstep bag."
                )}
              </p>

              {/* Delivery Address snippet */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#E8C582' }}>
                <MapPin size={15} />
                <span>Flat 402, Green Meadows, 14th Main, HSR Layout (Silent delivery)</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(232, 197, 130, 0.25)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#E8C582', marginBottom: '12px' }}>
                Quick Doorstep Controls:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handlePauseTomorrow}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: isTomorrowPaused ? '#A26D24' : 'rgba(255, 255, 255, 0.1)',
                    color: '#FAF7F2',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pause size={15} /> {isTomorrowPaused ? "Resume Tomorrow's Run" : "Pause Tomorrow Only"}
                  </span>
                  <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>No charge</span>
                </button>

                <button
                  onClick={handleAddExtraBottle}
                  disabled={extraMilkAdded}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: extraMilkAdded ? '#196D3D' : 'rgba(255, 255, 255, 0.1)',
                    color: '#FAF7F2',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: extraMilkAdded ? 'default' : 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={15} /> {extraMilkAdded ? "Extra 1L Milk Added ✓" : "Add +1 Extra Bottle Tomorrow"}
                  </span>
                  <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>+₹76.50</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards: Subscriptions, Wallet & Bottles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {/* Active Subscriptions Snapshot */}
          <div className="card-artisan" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Active Morning Subscriptions</span>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
                  {activeSubscriptions.length} Products
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FAF5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A26D24' }}>
                <Calendar size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#55685C', marginBottom: '16px' }}>
              {activeSubscriptions.map(s => `${s.quantity}x ${s.productName}`).join(', ')}
            </div>
            <Link to="/account/subscriptions" style={{ fontSize: '0.82rem', fontWeight: '700', color: '#A26D24', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Manage Subscriptions &amp; Vacation <ArrowRight size={13} />
            </Link>
          </div>

          {/* Wallet Balance */}
          <div className="card-artisan" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>MilkMart Wallet Balance</span>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#183626', marginTop: '2px' }}>
                  ₹{user?.walletBalance || 0}
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FDF6E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A26D24' }}>
                <WalletIcon size={22} />
              </div>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#196D3D', fontWeight: '600', marginBottom: '16px' }}>
              Auto-debits sunrise deliveries smoothly
            </div>
            <Link to="/account/wallet" style={{ fontSize: '0.82rem', fontWeight: '700', color: '#A26D24', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Add Money &amp; View Passbook <ArrowRight size={13} />
            </Link>
          </div>

          {/* Glass Bottle Circular Loop Credits */}
          <div className="card-artisan" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#798C80', fontWeight: '600' }}>Glass Bottles Returned Total</span>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.8rem', fontWeight: '700', color: '#196D3D', marginTop: '2px' }}>
                  {user?.bottlesReturnedTotal || 18} Bottles
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#196D3D' }}>
                <RefreshCcw size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#55685C', marginBottom: '16px' }}>
              ₹{(user?.bottlesReturnedTotal || 18) * 10} credited back to wallet • Zero plastic waste!
            </div>
            <Link to="/account/wallet" style={{ fontSize: '0.82rem', fontWeight: '700', color: '#196D3D', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Bottle Credit Receipts <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Latest Order & Traceability */}
        {latestOrder && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E6DEC9',
            padding: '24px',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#183626', margin: 0 }}>
                  Active Order #{latestOrder.id}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#798C80' }}>
                  Placed on {latestOrder.date} • {latestOrder.timeSlot}
                </span>
              </div>
              <span style={{
                backgroundColor: latestOrder.status === 'Delivered' ? '#E8F5EE' : '#FDF4E3',
                color: latestOrder.status === 'Delivered' ? '#196D3D' : '#8E5A17',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: '700'
              }}>
                {latestOrder.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {latestOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#798C80' }}>Qty: {item.quantity} • {item.size}</div>
                  </div>
                  <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.92rem' }}>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1EDE3', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.84rem', color: '#55685C' }}>
                Total: <strong>₹{latestOrder.total}</strong> ({latestOrder.paymentMethod})
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/orders/${latestOrder.id}`} className="btn btn-outline-dark btn-sm">
                  View Timeline &amp; Purity Certificate
                </Link>
                <Link to="/account/orders" className="btn btn-ghost btn-sm">
                  All Orders
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
