import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, Truck, User, LogIn, Sparkles } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { switchRole, currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('surya.prakash@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Surya Prakash');
  const [phone, setPhone] = useState('+91 98450 12345');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole('customer');
    showToast(`Welcome back, ${name}!`);
    onClose();
    navigate('/');
  };

  const handleDemoLogin = (role) => {
    switchRole(role);
    if (role === 'admin') {
      showToast("Signed in as Dairy Operations Master (Admin)");
      onClose();
      navigate('/admin');
    } else if (role === 'delivery') {
      showToast("Signed in as Ramesh Kumar (Morning Route 4B)");
      onClose();
      navigate('/delivery');
    } else {
      showToast("Signed in as Customer (Surya Prakash)");
      onClose();
      navigate('/');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '24px',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: '#FAF7F2',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ marginBottom: '12px' }}>
            <BrandLogo variant="compact" theme="light" size="sm" />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#FAF7F2', margin: 0 }}>
            {tab === 'login' ? "Sign In to Your Dairy Account" : "Join the Glass-Bottle Loop"}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#CBD5CB' }}>
            Fresh raw A2 milk, butter, and daily morning runs delivered before sunrise
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div style={{
          backgroundColor: '#FAF5EE',
          borderBottom: '1px solid #E6DEC9',
          padding: '14px 24px'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8E5A17', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={13} /> 1-Click Instant Demo Login:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleDemoLogin('customer')}
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, fontSize: '0.76rem', padding: '6px 8px' }}
            >
              <User size={13} /> Customer
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, fontSize: '0.76rem', padding: '6px 8px', color: '#0E587B' }}
            >
              <ShieldCheck size={13} /> Admin Hub
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setTab('login')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: tab === 'login' ? '700' : '500',
                backgroundColor: tab === 'login' ? '#183626' : '#FAF7F2',
                color: tab === 'login' ? '#FAF7F2' : '#55685C',
                border: tab === 'login' ? '1px solid #183626' : '1px solid #E6DEC9',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: tab === 'register' ? '700' : '500',
                backgroundColor: tab === 'register' ? '#183626' : '#FAF7F2',
                color: tab === 'register' ? '#FAF7F2' : '#55685C',
                border: tab === 'register' ? '1px solid #183626' : '1px solid #E6DEC9',
                cursor: 'pointer'
              }}
            >
              New Registration
            </button>
          </div>

          {tab === 'register' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Surya Prakash" style={{ width: '100%' }} />
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" style={{ width: '100%' }} />
          </div>

          {tab === 'register' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Mobile Phone (for sunrise doorstep drop)</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98450 12345" style={{ width: '100%' }} />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%' }} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            <LogIn size={18} /> {tab === 'login' ? "Sign In to MilkMart" : "Create Account & Start Delivery"}
          </button>
        </form>
      </div>
    </div>
  );
};
