import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle, Truck, Package, Calendar, ArrowRight, 
  ShieldCheck, RefreshCcw, Smartphone, Share2, Check, ExternalLink 
} from 'lucide-react';
import { buildOrderWhatsAppMessage, openWhatsApp } from '../../utils/whatsappNotification';

export const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'MM-98241';
  const { getOrderById } = useOrders();
  const { currentUser } = useAuth();

  const [enableWhatsApp, setEnableWhatsApp] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState(currentUser?.phone || '+91 98450 12345');

  const order = getOrderById(orderId) || {
    id: orderId,
    total: 220,
    timeSlot: "Morning Run: 5:30 AM – 7:30 AM",
    estimatedDelivery: "Tomorrow Morning (5:30 AM – 7:30 AM)",
    paymentMethod: "UPI (Google Pay)",
    deliveryAddress: { house: "Flat 402, Green Meadows", street: "14th Main, HSR Layout", city: "Bengaluru", phone: "+91 98450 12345" },
    items: [
      { name: "Raw Desi Gir Cow A2 Milk", size: "1 Liter", quantity: 2, price: 90 },
      { name: "Cultured A2 Vedic Bilona Ghee", size: "250ml", quantity: 1, price: 380 }
    ]
  };

  const whatsappMessage = buildOrderWhatsAppMessage(order, currentUser);

  const handleOpenWhatsApp = () => {
    openWhatsApp(recipientPhone, whatsappMessage);
  };

  return (
    <div style={{ padding: '50px 0 80px 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E6DEC9',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 14px 40px rgba(24, 54, 38, 0.08)'
        }}>
          {/* Success Check Badge */}
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: '#E8F5EE',
            color: '#196D3D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto',
            border: '2px solid rgba(25, 109, 61, 0.3)'
          }}>
            <CheckCircle size={42} />
          </div>

          <span style={{
            backgroundColor: '#FDF4E3',
            color: '#8E5A17',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '10px'
          }}>
            Order Confirmed &amp; Milking Batch Allocated
          </span>

          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2.2rem', color: '#183626', margin: '0 0 10px 0' }}>
            Thank you for choosing pure ethical dairy!
          </h1>

          <p style={{ fontSize: '0.94rem', color: '#55685C', lineHeight: 1.6, marginBottom: '24px' }}>
            Your order <strong>#{order.id}</strong> has been received by our morning dairy hub. Fresh milk is chilled to 3.6°C and delivered quietly to your doorstep before sunrise.
          </p>

          {/* Quick Snapshot Card */}
          <div style={{
            backgroundColor: '#FAF5EE',
            border: '1px solid #E6DEC9',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#798C80' }}>Order Identifier:</span>
              <strong style={{ color: '#183626' }}>#{order.id}</strong>
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
              <strong style={{ fontSize: '1.2rem', color: '#183626' }}>₹{order.total}</strong>
            </div>
          </div>

          {/* WhatsApp Order Notification Card */}
          <div style={{
            backgroundColor: '#E7F7ED',
            borderRadius: '18px',
            border: '1.5px solid #25D366',
            padding: '20px 22px',
            textAlign: 'left',
            marginBottom: '24px',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Smartphone size={16} />
                </div>
                <strong style={{ fontSize: '0.95rem', color: '#0B4D26' }}>
                  Live WhatsApp Order Tracking &amp; Invoice
                </strong>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#0B4D26', fontWeight: '700', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableWhatsApp}
                  onChange={(e) => setEnableWhatsApp(e.target.checked)}
                  style={{ accentColor: '#25D366', width: '15px', height: '15px' }}
                />
                Enabled
              </label>
            </div>

            <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: '#183626', lineHeight: 1.5 }}>
              Receive sunrise doorstep arrival alert, partner EV location, and bottle return credit notifications directly on WhatsApp.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                }}
              >
                <ExternalLink size={15} /> Open Order in WhatsApp
              </button>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0B4D26',
                  border: '1px solid #A3E3B9',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {showPreview ? 'Hide Message Preview' : 'Preview WhatsApp Message'}
              </button>
            </div>

            {/* Collapsible WhatsApp Message Preview Box */}
            {showPreview && (
              <div style={{
                marginTop: '16px',
                backgroundColor: '#ECE5DD', // Classic WhatsApp wallpaper background
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #CCD8D0'
              }}>
                <div style={{
                  backgroundColor: '#DCF8C6', // WhatsApp incoming bubble green
                  borderRadius: '10px',
                  padding: '14px 16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  fontSize: '0.82rem',
                  color: '#111111',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5,
                  maxWidth: '100%',
                  position: 'relative'
                }}>
                  {whatsappMessage}
                  <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#798C80', marginTop: '6px' }}>
                    Just now • ✓✓
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Doorstep Reminder */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#FAF5EE',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '28px',
            textAlign: 'left',
            fontSize: '0.82rem',
            color: '#183626',
            border: '1px solid #E6DEC9'
          }}>
            <RefreshCcw size={22} color="#196D3D" style={{ flexShrink: 0 }} />
            <div>
              <strong>Empty Glass Bottle Loop:</strong> Place your rinsed bottles in your doorstep pouch tonight. Delivery partner Ramesh collects them before 7:30 AM and credits ₹10 per bottle to your wallet!
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/orders/${order.id}`} className="btn btn-dark btn-lg">
              <Truck size={18} /> Live Order Tracking (Swiggy Style)
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
