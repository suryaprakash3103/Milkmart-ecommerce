import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { Package, Truck, ArrowRight, RefreshCcw, Calendar, CheckCircle } from 'lucide-react';

export const OrdersPage = () => {
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item, item.size, item.quantity);
    });
    navigate('/cart');
  };

  return (
    <div style={{ padding: '36px 0 70px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#183626', margin: 0 }}>
            Orders &amp; Morning Milk Runs
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#55685C', marginTop: '4px' }}>
            Track active morning doorstep dispatches and view past farm invoices
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E6DEC9',
            padding: '60px 24px',
            textAlign: 'center'
          }}>
            <Package size={48} color="#798C80" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ color: '#183626', fontSize: '1.4rem', marginBottom: '8px' }}>No Orders Found</h3>
            <p style={{ color: '#798C80', fontSize: '0.9rem', marginBottom: '20px' }}>
              You haven't placed any morning dairy orders yet.
            </p>
            <Link to="/products" className="btn btn-primary">Browse Dairy Catalog</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const isDelivered = order.status === 'Delivered';
              const isOut = order.status === 'Out for Delivery';

              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1px solid #E6DEC9',
                    padding: '24px',
                    boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
                  }}
                >
                  {/* Order Top Bar */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderBottom: '1px solid #F1EDE3',
                    paddingBottom: '14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: '700', fontSize: '1.15rem', color: '#183626' }}>
                        Order #{order.id}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#798C80' }}>
                        Placed on {order.date}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        backgroundColor: isDelivered ? '#E8F5EE' : isOut ? '#FDF4E3' : '#E2F2F9',
                        color: isDelivered ? '#196D3D' : isOut ? '#8E5A17' : '#0E587B'
                      }}>
                        {order.status}
                      </span>

                      <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#183626' }}>
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#183626' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#798C80' }}>
                            Qty: {item.quantity} • Size: {item.size} • ₹{item.price} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderTop: '1px solid #F1EDE3',
                    paddingTop: '14px'
                  }}>
                    <div style={{ fontSize: '0.82rem', color: '#55685C' }}>
                      <strong>Slot:</strong> {order.timeSlot} • <strong>Delivery:</strong> {order.deliveryAddress?.house}, {order.deliveryAddress?.city}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleReorder(order)}
                        className="btn btn-ghost btn-sm"
                      >
                        Re-order Items
                      </button>

                      <Link
                        to={`/orders/${order.id}`}
                        className="btn btn-dark btn-sm"
                      >
                        <Truck size={14} /> Live Tracking &amp; Details <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
