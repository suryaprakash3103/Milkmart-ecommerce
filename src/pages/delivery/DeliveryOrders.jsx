import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { 
  Truck, CheckCircle, MapPin, Phone, 
  RefreshCcw, ArrowLeft, ArrowRight, ShieldCheck, Check 
} from 'lucide-react';

export const DeliveryOrders = () => {
  const { orders, updateOrderStatus, recordBottleReturn } = useOrders();
  const { showToast } = useToast();

  const [collectModalOrder, setCollectModalOrder] = useState(null);
  const [bottlesCount, setBottlesCount] = useState(2);

  const handleAdvanceStatus = (order) => {
    let nextStatus = 'Picked Up';
    if (order.status === 'Confirmed' || order.status === 'Pending') nextStatus = 'Picked Up';
    else if (order.status === 'Picked Up') nextStatus = 'Out for Delivery';
    else if (order.status === 'Out for Delivery') nextStatus = 'Delivered';

    updateOrderStatus(order.id, nextStatus);
    showToast(`Order #${order.id} moved to '${nextStatus}'!`);
  };

  const handleRecordBottles = (e) => {
    e.preventDefault();
    if (!collectModalOrder) return;
    recordBottleReturn(collectModalOrder.id, Number(bottlesCount));
    setCollectModalOrder(null);
  };

  return (
    <div style={{ padding: '24px 0 70px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/delivery" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', fontWeight: '600', color: '#183626' }}>
            <ArrowLeft size={16} /> Back to Delivery Dashboard
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
              Route 4B Doorstep Manifest
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
              Morning stops in HSR Layout &amp; Koramangala. Deliver cold and collect empty glass bottles.
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {orders.map((order, idx) => {
            const isDelivered = order.status === 'Delivered';

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: isDelivered ? '1.5px solid #E8F5EE' : '1.5px solid #E6DEC9',
                  padding: '24px',
                  boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      backgroundColor: '#183626',
                      color: '#FAF7F2',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: '800'
                    }}>
                      {idx + 1}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: '#183626' }}>
                      Stop #{order.id} — {order.deliveryAddress?.name}
                    </strong>
                  </div>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    backgroundColor: isDelivered ? '#E8F5EE' : '#FDF4E3',
                    color: isDelivered ? '#196D3D' : '#8E5A17'
                  }}>
                    {order.status}
                  </span>
                </div>

                {/* Address & Instructions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.88rem', color: '#183626', marginBottom: '4px' }}>
                      <MapPin size={16} color="#183626" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{order.deliveryAddress?.house}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#798C80', marginLeft: '22px' }}>
                      <Phone size={13} /> {order.deliveryAddress?.phone}
                    </div>
                  </div>

                  {order.deliveryAddress?.dropInstruction && (
                    <div style={{ backgroundColor: '#FAF5EE', border: '1px solid #E6DEC9', borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', color: '#8E5A17' }}>
                      <strong>Doorstep Note:</strong> {order.deliveryAddress.dropInstruction}
                    </div>
                  )}
                </div>

                {/* Items to deliver */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '700', color: '#183626' }}>Drop off: </span>
                  {order.items.map(i => `${i.quantity}x ${i.name} (${i.size})`).join(' + ')}
                </div>

                {/* Action buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  borderTop: '1px solid #F1EDE3',
                  paddingTop: '14px'
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCollectModalOrder(order)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#196D3D', borderColor: 'rgba(25, 109, 61, 0.4)' }}
                    >
                      <RefreshCcw size={14} /> Collect Empty Bottles (+₹10/ea)
                    </button>

                    {order.bottlesReturned > 0 && (
                      <span style={{ fontSize: '0.78rem', color: '#196D3D', fontWeight: '700', alignSelf: 'center' }}>
                        ✓ {order.bottlesReturned} Bottles Collected
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm">
                      Details
                    </Link>

                    {!isDelivered ? (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        className="btn btn-dark btn-sm"
                      >
                        <Check size={14} /> Advance: Mark as {order.status === 'Out for Delivery' ? 'Delivered' : 'Next Step'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.84rem', color: '#196D3D', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={15} /> Completed at Doorstep
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Record Empty Glass Bottle Return */}
        {collectModalOrder && (
          <div className="modal-backdrop" onClick={() => setCollectModalOrder(null)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <form onSubmit={handleRecordBottles} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E8F5EE', color: '#196D3D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCcw size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#183626', margin: 0 }}>
                      Collect Empty Glass Bottles
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#798C80' }}>
                      Customer: {collectModalOrder.deliveryAddress?.name}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#55685C', lineHeight: 1.5, marginBottom: '18px' }}>
                  Confirm the number of rinsed empty MilkMart glass bottles collected from the doorstep pouch. The customer's wallet will automatically receive <strong>₹10 per bottle</strong>.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', marginBottom: '6px' }}>
                    Bottles Collected
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setBottlesCount(n)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          border: bottlesCount === n ? '2px solid #183626' : '1px solid #E6DEC9',
                          backgroundColor: bottlesCount === n ? '#FAF5EE' : '#FFFFFF',
                          color: '#183626',
                          cursor: 'pointer'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#E8F5EE',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  color: '#196D3D'
                }}>
                  <span>Customer Wallet Credit:</span>
                  <span>+₹{bottlesCount * 10}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Confirm &amp; Credit Wallet
                  </button>
                  <button type="button" onClick={() => setCollectModalOrder(null)} className="btn btn-ghost">
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
