import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} status set to: ${newStatus}`);
  };

  const handleDriverChange = (orderId, driverString) => {
    const namePart = driverString.split(' (')[0];
    const routePart = driverString.includes('(') ? driverString.split('(')[1].replace(')', '') : 'Morning Route';
    updateOrderStatus(orderId, orders.find(o => o.id === orderId)?.status || 'Confirmed', {
      name: namePart,
      phone: "+91 98765 43210",
      route: routePart,
      vehicle: "Chilled EV Van"
    });
    showToast(`Assigned ${namePart} to Order #${orderId}`);
  };

  const deliveryDrivers = [
    "Ramesh Kumar (Route 4B)",
    "Suresh Gowda (Route 2A)",
    "Anand Verma (Route 5C)"
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#183626', margin: 0 }}>
          Customer Order Fulfillment &amp; Dispatch
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '4px' }}>
          Assign routes, allocate chilled morning dispatch vans, and advance fulfillment statuses
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E6DEC9',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF5EE', borderBottom: '1px solid #E6DEC9', color: '#183626' }}>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Order ID</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Customer</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Doorstep Items</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Amount</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Payment</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Delivery Driver</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Status Progression</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #F1EDE3' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <Link to={`/orders/${ord.id}`} style={{ fontWeight: '700', color: '#183626', textDecoration: 'none' }}>
                      #{ord.id}
                    </Link>
                    <div style={{ fontSize: '0.74rem', color: '#798C80' }}>{ord.date}</div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '600', color: '#183626' }}>{ord.deliveryAddress?.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#798C80' }}>{ord.deliveryAddress?.city} • {ord.deliveryAddress?.tag}</div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: '0.84rem', color: '#183626' }}>
                      {ord.items.map(i => `${i.quantity}x ${i.name} (${i.size})`).join(', ')}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px', fontWeight: '700', color: '#183626' }}>
                    ₹{ord.total}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#55685C' }}>{ord.paymentMethod}</span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <select
                      defaultValue={ord.deliveryPartner?.name ? `${ord.deliveryPartner.name} (${ord.deliveryPartner.route})` : deliveryDrivers[0]}
                      onChange={(e) => handleDriverChange(ord.id, e.target.value)}
                      style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                    >
                      {deliveryDrivers.map((driver) => (
                        <option key={driver} value={driver}>{driver}</option>
                      ))}
                    </select>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        backgroundColor: ord.status === 'Delivered' ? '#E8F5EE' : ord.status === 'Out for Delivery' ? '#FDF4E3' : '#E2F2F9',
                        color: ord.status === 'Delivered' ? '#196D3D' : ord.status === 'Out for Delivery' ? '#8E5A17' : '#0E587B'
                      }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
