import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  ArrowLeft, ShoppingBag, CheckCircle2, Clock, 
  MapPin, Phone, User, Package, Calendar, 
  Printer, ShieldCheck, Truck, AlertCircle, 
  Check, ChevronRight
} from 'lucide-react';

export const SellerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const stages = [
    { key: 'Pending', label: 'Order Received' },
    { key: 'Confirmed', label: 'Confirmed by Farm' },
    { key: 'Preparing', label: 'Chilling & Bottling' },
    { key: 'Ready for Pickup', label: 'Ready in Crates' },
    { key: 'Out for Delivery', label: 'Dispatched to Fleet' },
    { key: 'Delivered', label: 'Delivered to Doorstep' }
  ];

  const loadOrder = async () => {
    try {
      const ord = await sellerService.getOrderById(id);
      if (ord) {
        setOrder(ord);
      } else {
        showToast('Order not found', 'error');
        navigate('/seller/orders');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    const handleSync = () => loadOrder();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [id]);

  const handleAdvanceStatus = async (nextStatus) => {
    try {
      await sellerService.updateOrderStatus(order.id, nextStatus);
      showToast(`Order updated to '${nextStatus}'!`, 'success');
      loadOrder();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  if (loading || !order) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: '#55685C' }}>Loading order fulfillment details...</p>
      </div>
    );
  }

  const currentStatus = order.sellerStatus || order.status || 'Pending';
  const currentStageIndex = stages.findIndex(s => s.key.toLowerCase() === currentStatus.toLowerCase());
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <Link
            to="/seller/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#55685C',
              fontSize: '0.85rem',
              fontWeight: '600',
              textDecoration: 'none',
              marginBottom: '6px'
            }}
          >
            <ArrowLeft size={16} /> Back to Orders
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
              Order #{order.id}
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: currentStatus === 'Delivered' ? '#E8F5E9' : '#EFE8D8',
              color: currentStatus === 'Delivered' ? '#2E7D32' : '#183626',
              fontWeight: '700',
              fontSize: '0.8rem'
            }}>
              {currentStatus}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#55685C', margin: '4px 0 0 0' }}>
            Placed on {order.date || 'Today'} • Customer Payment: <strong>{order.paymentMethod || 'Prepaid UPI'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrintSlip}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #D5CBBB',
              backgroundColor: '#FFFFFF',
              color: '#183626',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Printer size={15} /> Print Packing Slip
          </button>
        </div>
      </div>

      {/* Fulfillment Status Stepper Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Fulfillment Workflow
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#55685C' }}>
            Update status to trigger customer tracking and delivery fleet routing
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '24px', overflowX: 'auto', padding: '10px 0' }}>
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            height: '3px',
            backgroundColor: '#E8E2D5',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            width: `${(activeIndex / (stages.length - 1)) * 100}%`,
            height: '3px',
            backgroundColor: '#183626',
            zIndex: 2,
            transition: 'width 0.3s ease'
          }} />

          {stages.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div 
                key={stage.key} 
                style={{ 
                  position: 'relative', 
                  zIndex: 3, 
                  textAlign: 'center', 
                  minWidth: '90px' 
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#183626' : '#FAF7F2',
                  border: isCurrent ? '3px solid #E8C582' : (isCompleted ? '2px solid #183626' : '2px solid #D5CBBB'),
                  color: isCompleted ? '#FAF7F2' : '#7E8B82',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}>
                  {isCompleted ? <Check size={14} /> : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? '800' : '600',
                  color: isCurrent ? '#183626' : '#7E8B82',
                  display: 'block'
                }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Controls for Seller */}
        <div style={{
          backgroundColor: '#FAF7F2',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid #E8E2D5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Current Stage</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#183626' }}>
              {stages[activeIndex]?.label || currentStatus}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {activeIndex < stages.length - 1 && (
              <button
                onClick={() => handleAdvanceStatus(stages[activeIndex + 1].key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#183626',
                  color: '#FAF7F2',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(24, 54, 38, 0.15)'
                }}
              >
                Mark as "{stages[activeIndex + 1].label}" <ChevronRight size={15} />
              </button>
            )}

            {currentStatus !== 'Delivered' && currentStatus !== 'Cancelled' && (
              <button
                onClick={() => handleAdvanceStatus('Delivered')}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #196D3D',
                  backgroundColor: '#E8F5E9',
                  color: '#196D3D',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Items & Customer Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Order Items Table Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="#A26D24" /> Ordered Products
          </h2>

          <div style={{ borderBottom: '1px solid #E8E2D5', paddingBottom: '12px', marginBottom: '12px' }}>
            {(order.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx < order.items.length - 1 ? '1px dashed #F0ECE1' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={item.image || '/images/products/milk-a2.jpg'} 
                    alt={item.name} 
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E8E2D5' }} 
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#183626' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#7E8B82' }}>
                      ₹{item.price} × {item.quantity} {item.unit || 'Bottle'}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#183626' }}>
                  ₹{(item.price || 0) * (item.quantity || 1)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
              <span>Items Subtotal</span>
              <span>₹{order.subtotal || order.total || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
              <span>Delivery Slot (Morning Eco-Drop)</span>
              <span>₹{order.deliveryFee || 0} (Free)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55685C' }}>
              <span>Glass Bottle Deposit</span>
              <span>₹0 (Refundable Passbook)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.05rem', color: '#183626', borderTop: '1px solid #E8E2D5', paddingTop: '10px', marginTop: '4px' }}>
              <span>Total Bill</span>
              <span>₹{order.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Information Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <h2 style={{ fontSize: '1.15rem', color: '#183626', margin: '0 0 16px 0', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#A26D24" /> Customer &amp; Delivery Destination
          </h2>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Customer Name</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#183626' }}>
              {order.deliveryAddress?.name || order.customerName || 'Surya Prakash'}
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Contact Phone</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#183626', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="#196D3D" /> {order.deliveryAddress?.phone || '+91 98450 12345'}
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Delivery Address</div>
            <div style={{ fontSize: '0.9rem', color: '#183626', lineHeight: 1.5, marginTop: '4px', backgroundColor: '#FAF7F2', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8E2D5' }}>
              <MapPin size={15} color="#A26D24" style={{ display: 'inline', marginRight: '6px' }} />
              {order.deliveryAddress?.street || order.deliveryAddress?.address || 'Flat 402, Green Acres Apt, HSR Layout, Bengaluru, Karnataka - 560102'}
            </div>
          </div>

          <div style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#E8F5E9',
            border: '1px solid #C8E6C9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={20} color="#2E7D32" />
            <div style={{ fontSize: '0.8rem', color: '#1B5E20' }}>
              <strong>Verified MilkMart Cold-Chain Dispatch:</strong> Dispatched in sanitized crates below 4°C with digital seal tracking.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
