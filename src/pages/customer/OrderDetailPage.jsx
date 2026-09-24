import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { 
  ArrowLeft, Truck, CheckCircle2, Clock, MapPin, 
  Phone, ShieldCheck, RefreshCcw, User, Check, FileText 
} from 'lucide-react';
import { TaxInvoiceModal } from '../../components/common/TaxInvoiceModal';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { getOrderById } = useOrders();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3>Order not found.</h3>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Orders</Link>
      </div>
    );
  }

  const isDelivered = order.status === 'Delivered';

  return (
    <div style={{ padding: '36px 0 70px 0' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Back navigation */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#183626' }}>
            <ArrowLeft size={16} /> Back to All Orders
          </Link>
        </div>

        {/* Header Title Card */}
        <div style={{
          backgroundColor: '#183626',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#FAF7F2',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#E8C582', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Sunrise Doorstep Dispatch
            </div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2rem', color: '#FAF7F2', margin: '4px 0' }}>
              Order #{order.id}
            </h1>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#CBD5CB' }}>
              Placed on {order.date} • {order.paymentMethod}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              backgroundColor: '#E8C582',
              color: '#183626',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '800',
              display: 'inline-block'
            }}>
              {order.status}
            </span>
            <div style={{ marginTop: '8px', fontSize: '0.84rem', color: '#FAF7F2' }}>
              Window: <strong>{order.timeSlot}</strong>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(232, 197, 130, 0.4)',
                  color: '#FAF7F2',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <FileText size={14} color="#E8C582" /> View GST Tax Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Visual 5-Step Order Tracking Timeline */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E6DEC9',
          padding: '32px',
          marginBottom: '28px',
          boxShadow: '0 4px 16px rgba(24, 54, 38, 0.04)'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: '#183626', marginBottom: '24px' }}>
            Live Cold-Chain Doorstep Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            {order.timeline.map((step, idx) => {
              const isDone = step.completed;
              const isCurrent = step.active;

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                  {/* Step Icon */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#183626' : '#FAF5EE',
                    color: isDone ? '#FAF7F2' : '#798C80',
                    border: isCurrent ? '3px solid #E8C582' : isDone ? '2px solid #183626' : '1px solid #E6DEC9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    flexShrink: 0
                  }}>
                    {isDone ? <Check size={18} /> : <span>{idx + 1}</span>}
                  </div>

                  {/* Text details */}
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{
                        fontSize: '0.98rem',
                        color: isDone ? '#183626' : '#798C80'
                      }}>
                        {step.title}
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: isDone ? '#8E5A17' : '#798C80', fontWeight: '600' }}>
                        {step.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Grid (Delivery Partner + Address + Summary) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {/* Assigned Delivery Driver */}
          {order.deliveryPartner && (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E6DEC9',
              padding: '22px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Truck size={18} color="#183626" />
                <h4 style={{ fontSize: '1.05rem', color: '#183626', margin: 0 }}>
                  Morning Delivery Partner
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FAF5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183626', fontWeight: '700' }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#183626' }}>
                    {order.deliveryPartner.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#798C80' }}>
                    {order.deliveryPartner.route}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#55685C', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Phone:</strong> {order.deliveryPartner.phone}</div>
                <div><strong>Vehicle:</strong> {order.deliveryPartner.vehicle}</div>
              </div>
            </div>
          )}

          {/* Delivery Address & Instructions */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E6DEC9',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={18} color="#183626" />
              <h4 style={{ fontSize: '1.05rem', color: '#183626', margin: 0 }}>
                Doorstep Drop Location
              </h4>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#183626', fontWeight: '700', marginBottom: '4px' }}>
              {order.deliveryAddress?.tag} — {order.deliveryAddress?.name}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#55685C', lineHeight: 1.5, marginBottom: '10px' }}>
              {order.deliveryAddress?.house}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
            </div>
            {order.deliveryAddress?.dropInstruction && (
              <div style={{ backgroundColor: '#FAF5EE', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#8E5A17' }}>
                <strong>Note:</strong> {order.deliveryAddress.dropInstruction}
              </div>
            )}
          </div>
        </div>

        {/* Products Table & Bill */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E6DEC9',
          padding: '24px'
        }}>
          <h4 style={{ fontSize: '1.1rem', color: '#183626', marginBottom: '16px' }}>
            Delivered Farm Products
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '12px', borderBottom: '1px solid #F1EDE3' }}>
                <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#183626' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#798C80' }}>Pack: {item.size} • Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: '700', color: '#183626', fontSize: '1rem' }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#798C80' }}>
                <span>Subtotal</span>
                <span style={{ color: '#183626', fontWeight: '600' }}>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E5A17', fontWeight: '600' }}>
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#798C80' }}>
                <span>Sunrise Delivery</span>
                <span style={{ color: '#196D3D', fontWeight: '600' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E6DEC9', paddingTop: '8px', fontSize: '1.15rem', fontWeight: '700', color: '#183626' }}>
                <span>Total</span>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* GST Tax Invoice Modal */}
        <TaxInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={order}
        />
      </div>
    </div>
  );
};
