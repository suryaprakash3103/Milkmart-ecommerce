import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, UserCheck, Home, LogIn } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export const UnauthorizedPage = () => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requiredRoles = location.state?.requiredRoles || [];

  const getPortalHome = () => {
    if (role === 'admin') return '/admin';
    if (role === 'delivery') return '/partner';
    return '/account';
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#FAF7F2'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E6DEC9',
        padding: '36px 32px',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(24, 54, 38, 0.08)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#FDE8E4',
          color: '#B2341A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <ShieldAlert size={34} />
        </div>

        <span style={{
          backgroundColor: '#FDE8E4',
          color: '#B2341A',
          fontSize: '0.78rem',
          fontWeight: '800',
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px'
        }}>
          403 Access Restricted
        </span>

        <h2 style={{ fontSize: '1.8rem', color: '#183626', margin: '14px 0 8px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
          Portal Permission Required
        </h2>

        <p style={{ fontSize: '0.92rem', color: '#55685C', lineHeight: 1.6, marginBottom: '24px' }}>
          You are currently signed in as <strong>{user?.name || 'Guest'}</strong> with the role of{' '}
          <strong style={{ color: '#183626', textTransform: 'capitalize' }}>{role || 'None'}</strong>.
          {requiredRoles.length > 0 && (
            <span> This section is reserved exclusively for <strong>{requiredRoles.join(', ')}</strong> access.</span>
          )}
        </p>

        {/* Action recommendations */}
        <div style={{
          backgroundColor: '#FAF5EE',
          borderRadius: '16px',
          border: '1px solid #E6DEC9',
          padding: '16px',
          marginBottom: '28px',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#8E5A17', marginBottom: '8px' }}>
            Switch demo persona or return to your portal:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { switchRole('customer'); navigate('/account'); }}
              className="btn btn-outline-dark btn-sm"
              style={{ flex: 1, fontSize: '0.76rem' }}
            >
              Sign as Customer
            </button>
            <button
              onClick={() => { switchRole('delivery'); navigate('/partner'); }}
              className="btn btn-outline-dark btn-sm"
              style={{ flex: 1, fontSize: '0.76rem' }}
            >
              Sign as Partner
            </button>
            <button
              onClick={() => { switchRole('admin'); navigate('/admin'); }}
              className="btn btn-outline-dark btn-sm"
              style={{ flex: 1, fontSize: '0.76rem' }}
            >
              Sign as Admin
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(getPortalHome())}
            className="btn btn-primary"
          >
            <Home size={15} /> Go to My {role ? role.toUpperCase() : 'PORTAL'}
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="btn btn-ghost"
          >
            <LogIn size={15} /> Switch User
          </button>
        </div>
      </div>
    </div>
  );
};
