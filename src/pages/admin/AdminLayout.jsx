import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { 
  LayoutDashboard, Package, FolderTree, Boxes, 
  ShoppingBag, Calendar, Users, Tag, Truck, 
  BarChart3, ArrowLeft, ThermometerSnowflake, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export const AdminLayout = () => {
  const { switchRole } = useAuth();
  const { chillerTelemetry } = useProducts();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products Catalog', icon: Package },
    { to: '/admin/categories', label: 'Dairy Categories', icon: FolderTree },
    { to: '/admin/inventory', label: 'Inventory & Vats', icon: Boxes },
    { to: '/admin/orders', label: 'Customer Orders', icon: ShoppingBag },
    { to: '/admin/subscriptions', label: 'Morning Runs', icon: Calendar },
    { to: '/admin/customers', label: 'Subscribers', icon: Users },
    { to: '/admin/offers', label: 'Offers & Coupons', icon: Tag },
    { to: '/admin/delivery', label: 'Fleet Routes', icon: Truck },
    { to: '/admin/reports', label: 'Reports & Volume', icon: BarChart3 }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF7F2' }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0F2318',
        color: '#FAF7F2',
        borderRight: '1px solid rgba(232, 197, 130, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Hub Brand Header */}
        <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <BrandLogo variant="compact" theme="light" size="sm" />
          <div style={{ fontSize: '0.68rem', color: '#E8C582', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '6px', paddingLeft: '42px' }}>
            Operations Hub
          </div>
        </div>

        {/* Chiller Telemetry Pill */}
        <div style={{
          margin: '14px 16px',
          padding: '10px 12px',
          borderRadius: '10px',
          backgroundColor: 'rgba(14, 88, 123, 0.25)',
          border: '1px solid rgba(14, 88, 123, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem'
        }}>
          <ThermometerSnowflake size={16} color="#5CD685" />
          <div>
            <span style={{ color: '#CBD5CB' }}>Chiller Vats Temp:</span>
            <strong style={{ color: '#5CD685', marginLeft: '4px' }}>{chillerTelemetry.averageChillerTemp}°C (Optimal)</strong>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#183626' : '#D5DFC8',
                  backgroundColor: isActive ? '#E8C582' : 'transparent',
                  transition: 'background-color 0.15s'
                })}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Return to Customer Portal */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(232, 197, 130, 0.3)',
              color: '#E8C582',
              fontSize: '0.84rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={15} /> Customer Storefront
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};
