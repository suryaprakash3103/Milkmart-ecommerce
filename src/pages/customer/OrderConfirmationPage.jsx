import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { CheckCircle, Truck, Package, Calendar, ArrowRight, ShieldCheck, RefreshCcw } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'MM-98241';
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId) || {
    id: orderId,
    total: 220,
    timeSlot: "Morning Run: 5:30 AM – 7:30 AM",
    estimatedDelivery: "Tomorrow Morning (5:30 AM – 7:30 AM)",
    deliveryAddress: { house: "Flat 402, Green Meadows", street: "14th Main, HSR Layout", city: "Bengaluru" }
  };

  return (
    <div style={{ padding: '60px 0 90px 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E6DEC9',
          padding: '44px 36px',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(24, 54, 38, 0.08)'
        }}>
          {/* Success Check Badge */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#E8F5EE',
            color: '#196D3D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            border: '2px solid rgba(25, 109, 61, 0.3)'
          }}>
            <CheckCircle size={44} />
          </div>

          <span style={{
            backgroundColor: '#FDF4E3',
            color: '#8E5A17',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '10px'
          }}>
            Order Confirmed &amp; Milking Batch Allocated
          </span>

          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2.3rem', color: '#183626', margin: '0 0 10px 0' }}>
            Thank you for choosing ethical dairy!
          </h1>

          <p style={{ fontSize: '0.98rem', color: '#55685C', lineHeight: 1.6, marginBottom: '24px' }}>
            Your order <strong>#{order.id}</strong> has been received by our morning dairy hub. Fresh milk will be chilled to 3.8°C and delivered quietly to your doorstep before sunrise.
          </p>

          {/* Quick Snapshot Card */}
          <div style={{
            backgroundColor: '#FAF5EE',
            border: '1px solid #E6DEC9',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#798C80' }}>Order Identifier:</span>
              <strong style={{ color: '#183626' }}>{order.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#798C80' }}>Delivery Window:</span>
              <strong style={{ color: '#196D3D' }}>{order.timeSlot}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#798C80' }}>Delivering to:</span>
              <span style={{ color: '#183626', textAlign: 'right', maxWidth: '300px' }}>
                {order.deliveryAddress?.house}, {order.deliveryAddress?.street}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E6DEC9', paddingTop: '10px' }}>
              <span style={{ color: '#798C80' }}>Total Paid:</span>
              <strong style={{ fontSize: '1.15rem', color: '#183626' }}>₹{order.total}</strong>
            </div>
          </div>

          {/* Doorstep Reminder */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#E8F5EE',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '30px',
            textAlign: 'left',
            fontSize: '0.84rem',
            color: '#183626'
          }}>
            <RefreshCcw size={22} color="#196D3D" style={{ flexShrink: 0 }} />
            <div>
              <strong>Empty Bottle Reminder:</strong> Please place your rinsed glass bottles in your doorstep pouch tonight. Our morning partner will collect them and credit ₹10 per bottle to your wallet!
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/orders/${order.id}`} className="btn btn-dark btn-lg">
              <Truck size={18} /> Live Order Tracking
            </Link>
            <Link to="/products" className="btn btn-ghost btn-lg">
              Browse More Dairy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
