import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { 
  Bell, CheckCircle2, AlertTriangle, Info, 
  ShoppingBag, Check, CheckCheck, Trash2, 
  ExternalLink, Sparkles
} from 'lucide-react';

export const SellerNotifications = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread

  const loadNotifications = async () => {
    if (user?.id) {
      const list = await sellerService.getNotifications(user.id);
      setNotifications(list);
    }
  };

  useEffect(() => {
    loadNotifications();
    const handleSync = () => loadNotifications();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  const handleMarkRead = async (id) => {
    await sellerService.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await sellerService.markAllNotificationsRead(user?.id);
    showToast('All notifications marked as read', 'success');
    loadNotifications();
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={20} color="#183626" />;
      case 'warning':
        return <AlertTriangle size={20} color="#B78103" />;
      case 'success':
      case 'verified':
        return <CheckCircle2 size={20} color="#2E7D32" />;
      default:
        return <Info size={20} color="#196D3D" />;
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#196D3D', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
            Real-Time Broadcasts
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#183626', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            Producer Notifications
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#55685C', marginTop: '2px' }}>
            Quality inspection approvals, dispatch alerts, and stock threshold notifications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleMarkAllRead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #D5CBBB',
              backgroundColor: '#FFFFFF',
              color: '#183626',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <CheckCheck size={15} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: filter === 'all' ? '#183626' : '#FAF7F2',
            color: filter === 'all' ? '#FAF7F2' : '#55685C',
            fontSize: '0.85rem',
            fontWeight: filter === 'all' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: filter === 'unread' ? '#183626' : '#FAF7F2',
            color: filter === 'unread' ? '#FAF7F2' : '#55685C',
            fontSize: '0.85rem',
            fontWeight: filter === 'unread' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notification Cards Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#7E8B82'
          }}>
            <Bell size={36} color="#C4BCB1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#183626', fontSize: '1.1rem' }}>No Notifications</h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>You're all caught up with your farm updates!</p>
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              style={{
                backgroundColor: notif.read ? '#FFFFFF' : '#F6F3EB',
                borderRadius: '14px',
                border: notif.read ? '1px solid #E8E2D5' : '1px solid #D5CBBB',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: notif.read ? 'none' : '0 2px 8px rgba(24, 54, 38, 0.05)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E8E2D5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#183626', fontWeight: notif.read ? '600' : '800' }}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A26D24' }} />
                    )}
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.86rem', color: '#55685C', lineHeight: 1.45 }}>
                    {notif.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#7E8B82' }}>
                      {notif.timestamp || 'Today'}
                    </span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        style={{
                          fontSize: '0.78rem',
                          color: '#183626',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        View Details <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  title="Mark as read"
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#7E8B82',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <Check size={18} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
