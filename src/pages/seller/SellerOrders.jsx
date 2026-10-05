import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  ShoppingBag, CheckCircle2, Clock, Truck, 
  MapPin, Package, ArrowRight, User, Calendar, 
  Sparkles, Filter, Search, Check, AlertCircle, 
  Eye, RefreshCw, ChevronRight, XCircle, ChevronDown, 
  Printer 
} from 'lucide-react';

export const SellerOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // table, cards

  const loadOrders = async () => {
    try {
      if (user?.id) {
        const list = await sellerService.getOrders(user.id);
        setOrders(list);
      }
    } catch (err) {
      console.error('Error fetching seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const handleSync = () => loadOrders();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await sellerService.updateOrderStatus(orderId, newStatus);
      showToast(`Order #${orderId} updated to '${newStatus}'!`, 'success');
      loadOrders();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const getNextStatus = (current) => {
    switch (current.toLowerCase()) {
      case 'pending': return 'Confirmed';
      case 'confirmed': return 'Preparing';
      case 'preparing': return 'Ready for Pickup';
      case 'ready for pickup':
      case 'ready': return 'Out for Delivery';
      case 'out for delivery': return 'Delivered';
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s === 'delivered') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
          <CheckCircle2 size={13} /> Delivered
        </span>
      );
    }
    if (s === 'out for delivery') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#E3F2FD', color: '#1565C0' }}>
          <Truck size={13} /> Out for Delivery
        </span>
      );
    }
    if (s === 'ready for pickup' || s === 'ready') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FFF3E0', color: '#E65100' }}>
          <Package size={13} /> Ready for Pickup
        </span>
      );
    }
    if (s === 'preparing') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#EDE7F6', color: '#512DA8' }}>
          <Clock size={13} /> Chilling &amp; Bottling
        </span>
      );
    }
    if (s === 'confirmed') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#E8F5E9', color: '#1B5E20' }}>
          <Check size={13} /> Confirmed
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FFEBEE', color: '#C62828' }}>
          <XCircle size={13} /> Cancelled
        </span>
      );
    }
    // Pending
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FFF8E1', color: '#B78103' }}>
        <Clock size={13} /> Pending Review
      </span>
    );
  };

  const getOrderStatus = (o) => o.sellerStatus || o.status || 'Pending';

  const filteredOrders = orders.filter(o => {
    const s = searchTerm.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(s) ||
      (o.deliveryAddress?.name || o.customerName || '').toLowerCase().includes(s) ||
      (o.deliveryAddress?.phone || '').includes(s) ||
      (o.items?.some(i => i.name.toLowerCase().includes(s)));

    if (!matchSearch) return false;

    if (activeTab === 'all') return true;
    const current = getOrderStatus(o).toLowerCase();
    if (activeTab === 'pending') return current === 'pending';
    if (activeTab === 'confirmed') return current === 'confirmed';
    if (activeTab === 'preparing') return current === 'preparing';
    if (activeTab === 'ready') return current === 'ready for pickup' || current === 'ready';
    if (activeTab === 'out_for_delivery') return current === 'out for delivery';
    if (activeTab === 'delivered') return current === 'delivered';
    if (activeTab === 'cancelled') return current === 'cancelled';
    return true;
  });

  const countPending = orders.filter(o => getOrderStatus(o).toLowerCase() === 'pending').length;
  const countConfirmed = orders.filter(o => getOrderStatus(o).toLowerCase() === 'confirmed').length;
  const countPreparing = orders.filter(o => getOrderStatus(o).toLowerCase() === 'preparing' || getOrderStatus(o).toLowerCase() === 'ready for pickup' || getOrderStatus(o).toLowerCase() === 'ready').length;
  const countDelivered = orders.filter(o => getOrderStatus(o).toLowerCase() === 'delivered').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
            Farm Doorstep Procurement &amp; Fulfillment
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Dispatches &amp; Customer Orders
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
            Fulfill live doorstep orders for {user?.farmName || "Gir Amrit Organic Gaushala"}. Pack into sanitized glass bottles and release to delivery fleet.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadOrders}
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
            <RefreshCw size={15} /> Refresh Orders
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Total Orders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#183626', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {orders.length}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#55685C' }}>Lifetime farm shipments</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.78rem', color: '#B78103', textTransform: 'uppercase', fontWeight: '700' }}>Action Required</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#B78103', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {countPending + countConfirmed}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#8C6202' }}>{countPending} new pending • {countConfirmed} confirmed</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.78rem', color: '#512DA8', textTransform: 'uppercase', fontWeight: '700' }}>In Bottling / Ready</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#512DA8', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {countPreparing}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#512DA8' }}>Ready in chilled crates</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.78rem', color: '#2E7D32', textTransform: 'uppercase', fontWeight: '700' }}>Completed Drops</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2E7D32', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {countDelivered}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#1B5E20' }}>Delivered to doorsteps</div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D5',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#7E8B82" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Order #, customer name, phone, or milk SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #D5CBBB',
              fontSize: '0.88rem',
              backgroundColor: '#FAF7F2'
            }}
          />
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'table' ? '#183626' : '#FAF7F2',
              color: viewMode === 'table' ? '#FAF7F2' : '#55685C',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'cards' ? '#183626' : '#FAF7F2',
              color: viewMode === 'cards' ? '#FAF7F2' : '#55685C',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Card Cards
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }}>
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'pending', label: `Pending (${countPending})` },
          { id: 'confirmed', label: `Confirmed (${countConfirmed})` },
          { id: 'preparing', label: 'Preparing / Bottling' },
          { id: 'ready', label: 'Ready for Pickup' },
          { id: 'out_for_delivery', label: 'Out for Delivery' },
          { id: 'delivered', label: `Delivered (${countDelivered})` },
          { id: 'cancelled', label: 'Cancelled' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: activeTab === tab.id ? '1px solid #183626' : '1px solid #E8E2D5',
              backgroundColor: activeTab === tab.id ? '#183626' : '#FFFFFF',
              color: activeTab === tab.id ? '#FAF7F2' : '#55685C',
              fontWeight: activeTab === tab.id ? '700' : '500',
              fontSize: '0.82rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders View: Table vs Cards */}
      {viewMode === 'table' ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D5',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(24, 54, 38, 0.04)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D5' }}>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Order ID</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Customer</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Product</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Quantity</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Amount</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Order Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#7E8B82', textTransform: 'uppercase', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#7E8B82' }}>
                      <ShoppingBag size={36} color="#C4BCB1" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontWeight: '700', color: '#183626', fontSize: '1rem' }}>No orders found</div>
                      <div style={{ fontSize: '0.85rem' }}>No shipments matching your filter criteria.</div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const currentStatus = getOrderStatus(order);
                    const nextStatus = getNextStatus(currentStatus);

                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #F0ECE1' }}>
                        {/* Order ID */}
                        <td style={{ padding: '14px 18px' }}>
                          <Link
                            to={`/seller/orders/${order.id}`}
                            style={{ fontWeight: '800', color: '#183626', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            #{order.id}
                          </Link>
                          <span style={{ fontSize: '0.72rem', color: '#7E8B82' }}>{order.paymentMethod || 'UPI Prepaid'}</span>
                        </td>

                        {/* Customer */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: '700', color: '#183626', fontSize: '0.9rem' }}>
                            {order.deliveryAddress?.name || order.customerName || 'Customer'}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#7E8B82' }}>
                            {order.deliveryAddress?.phone || '+91 98450 12345'}
                          </div>
                        </td>

                        {/* Product */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: '600', color: '#183626', fontSize: '0.88rem' }}>
                            {order.items?.[0]?.name || "Farm Fresh A2 Milk"}
                          </div>
                          {order.items?.length > 1 && (
                            <span style={{ fontSize: '0.74rem', color: '#A26D24', fontWeight: '600' }}>
                              +{order.items.length - 1} more items
                            </span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: '#183626' }}>
                          {order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1} units
                        </td>

                        {/* Amount */}
                        <td style={{ padding: '14px 18px', fontWeight: '800', color: '#196D3D', fontSize: '0.95rem' }}>
                          ₹{order.total || 170}
                        </td>

                        {/* Order Date */}
                        <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: '#55685C' }}>
                          {order.date || 'Today'}
                          <div style={{ fontSize: '0.72rem', color: '#7E8B82' }}>Slot: 06:00 AM</div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 18px' }}>
                          {getStatusBadge(currentStatus)}
                        </td>

                        {/* Action buttons */}
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            {/* Advance Step Button */}
                            {nextStatus && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, nextStatus)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: '#183626',
                                  color: '#FAF7F2',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {nextStatus === 'Confirmed' && '✓ Confirm'}
                                {nextStatus === 'Preparing' && '🍼 Prepare'}
                                {nextStatus === 'Ready for Pickup' && '📦 Pack Ready'}
                                {nextStatus === 'Out for Delivery' && '🚚 Hand to Fleet'}
                                {nextStatus === 'Delivered' && '✅ Mark Delivered'}
                              </button>
                            )}

                            {/* Status Selector Dropdown */}
                            <select
                              value={currentStatus}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                border: '1px solid #D5CBBB',
                                fontSize: '0.76rem',
                                backgroundColor: '#FAF7F2',
                                color: '#183626',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Ready for Pickup">Ready for Pickup</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* View Full Order Details Link */}
                            <Link
                              to={`/seller/orders/${order.id}`}
                              title="View Order Details & Packing Slip"
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px solid #D5CBBB',
                                backgroundColor: '#FFFFFF',
                                color: '#183626',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Eye size={14} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View for Orders */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', color: '#7E8B82' }}>
              No orders found matching this filter.
            </div>
          ) : (
            filteredOrders.map(order => {
              const currentStatus = getOrderStatus(order);
              const nextStatus = getNextStatus(currentStatus);

              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D5',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(24, 54, 38, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to={`/seller/orders/${order.id}`} style={{ fontWeight: '800', color: '#183626', fontSize: '1.05rem', textDecoration: 'none' }}>
                          #{order.id}
                        </Link>
                        <span style={{ fontSize: '0.74rem', color: '#7E8B82' }}>• {order.date || 'Today'}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#183626', marginTop: '4px' }}>
                        {order.deliveryAddress?.name || order.customerName || 'Customer'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#55685C' }}>
                        {order.deliveryAddress?.street || order.deliveryAddress?.address || 'Doorstep Delivery'}
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(currentStatus)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ backgroundColor: '#FAF7F2', borderRadius: '10px', padding: '12px', fontSize: '0.84rem' }}>
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#183626', fontWeight: '600' }}>
                          {item.quantity}× {item.name}
                        </span>
                        <span style={{ color: '#196D3D', fontWeight: '700' }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px dashed #D5CBBB', paddingTop: '6px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: '#183626' }}>
                      <span>Total Procurement</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <Link
                      to={`/seller/orders/${order.id}`}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: '#183626',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      View Full Details <ChevronRight size={14} />
                    </Link>

                    {nextStatus && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, nextStatus)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#183626',
                          color: '#FAF7F2',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Advance to {nextStatus}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
