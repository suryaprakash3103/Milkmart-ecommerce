import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import { BrandLogo } from '../../components/common/BrandLogo';
import { 
  LayoutDashboard, Package, PlusCircle, Layers, 
  ShoppingBag, TrendingUp, FileCheck2, Award, 
  Bell, Settings, LogOut, ArrowLeft, Menu, X, 
  ShieldCheck, ExternalLink, HelpCircle, ThermometerSnowflake 
} from 'lucide-react';

export const SellerLayout = () => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(2);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [farm, setFarm] = useState(null);

  const loadData = async () => {
    if (user?.id) {
      const f = await sellerService.getFarmProfile(user.id);
      setFarm(f);
      const notifs = await sellerService.getNotifications(user.id);
      setUnreadCount(notifs.filter(n => !n.read).length);
    }
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('milkmart:datasync', handleSync);
    return () => window.removeEventListener('milkmart:datasync', handleSync);
  }, [user?.id]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/seller/products', label: 'My Products', icon: Package },
    { to: '/seller/products/new', label: 'Add Product', icon: PlusCircle },
    { to: '/seller/inventory', label: 'Inventory', icon: Layers },
    { to: '/seller/orders', label: 'Dispatches & Orders', icon: ShoppingBag },
    { to: '/seller/sales', label: 'Sales & Earnings', icon: TrendingUp },
    { to: '/seller/batches', label: 'Purity Lab Batches', icon: FileCheck2 },
    { to: '/seller/farm', label: 'Farm Profile', icon: Award },
    { to: '/seller/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/seller/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF7F2' }}>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside style={{
        width: '270px',
        backgroundColor: '#132A1E',
        color: '#FAF7F2',
        borderRight: '1px solid rgba(232, 197, 130, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 999,
        transition: 'transform 0.25s ease',
        transform: isMobileOpen ? 'translateX(0)' : undefined
      }}
      className={isMobileOpen ? 'seller-sidebar-open' : 'seller-sidebar'}
      >
        {/* Brand Header */}
        <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <BrandLogo variant="compact" theme="light" size="sm" />
            <div style={{ fontSize: '0.68rem', color: '#E8C582', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '6px' }}>
              Producer &amp; Farmer Hub
            </div>
          </div>
          {isMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: '#CBD5CB', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Farm Verification Pill */}
        <div style={{
          margin: '14px 16px',
          padding: '12px 14px',
          borderRadius: '12px',
          backgroundColor: 'rgba(232, 197, 130, 0.12)',
          border: '1px solid rgba(232, 197, 130, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#E8C582', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {farm?.name || user?.farmName || "Green Valley Dairy Farm"}
            </span>
            <span style={{ fontSize: '0.65rem', backgroundColor: '#196D3D', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
              ✓ Verified
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#CBD5CB' }}>
            {farm?.district || user?.district || "Coimbatore"} • FSSAI #{farm?.fssaiLicense || user?.fssaiLicense || "12421003000542"}
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '6px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = location.pathname === item.to || (item.to === '/seller/dashboard' && location.pathname === '/seller');

            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: isItemActive ? '700' : '500',
                  color: isItemActive ? '#183626' : '#D5DFC8',
                  backgroundColor: isItemActive ? '#E8C582' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span style={{
                    backgroundColor: isItemActive ? '#183626' : '#E8C582',
                    color: isItemActive ? '#E8C582' : '#183626',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => {
              switchRole('customer');
              navigate('/');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(232, 197, 130, 0.3)',
              color: '#E8C582',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Customer Marketplace
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/seller/login');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#CBD5CB',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area with Topbar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1.5px solid #E6DEC9',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          boxShadow: '0 2px 8px rgba(24, 54, 38, 0.03)'
        }}>
          {/* Mobile hamburger & page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsMobileOpen(true)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#183626',
                cursor: 'pointer',
                padding: '4px'
              }}
              className="seller-mobile-toggle"
            >
              <Menu size={22} />
            </button>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#183626', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#196D3D' }}></span>
              {farm?.name || user?.farmName || "Green Valley Dairy Farm"}
            </div>
          </div>

          {/* Right Topbar Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {farm?.id && (
              <Link
                to={`/farm/${farm.id}`}
                target="_blank"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FAF5EE',
                  border: '1px solid #E8C582',
                  color: '#A26D24',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                <ExternalLink size={13} /> View Public Farm Store
              </Link>
            )}

            <Link
              to="/seller/notifications"
              style={{
                position: 'relative',
                color: '#183626',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: '#FAF7F2',
                border: '1px solid #E6DEC9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: '#B2341A',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/seller/farm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: '#183626',
                backgroundColor: '#FAF7F2',
                padding: '5px 10px',
                borderRadius: '20px',
                border: '1px solid #E6DEC9'
              }}
            >
              <img
                src={user?.avatar || "/images/users/avatar.jpg"}
                alt={user?.name || "Farmer"}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>
                {user?.name?.split(' ')[0] || "Farmer"}
              </span>
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
