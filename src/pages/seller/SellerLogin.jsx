import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sellerService } from '../../services/sellerService';
import { BrandLogo } from '../../components/common/BrandLogo';
import { 
  Lock, Mail, Phone, Award, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, Store 
} from 'lucide-react';

export const SellerLogin = () => {
  const { switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrPhone, setEmailOrPhone] = useState('murugan.farm@milkmart.farm');
  const [password, setPassword] = useState('farmer123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromLocation = location.state?.from?.pathname || '/seller/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await sellerService.sellerLogin(emailOrPhone, password);
      showToast(`Welcome back, ${user.name}! (${user.farmName || 'Farm Producer'})`);
      navigate(fromLocation, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (sellerUser) => {
    setEmailOrPhone(sellerUser.email);
    setPassword(sellerUser.password);
    switchRole('seller');
    // Store selected user in session
    sellerService.updateSellerProfile(sellerUser.id, {});
    showToast(`Logged in as ${sellerUser.name} (${sellerUser.farm})`);
    navigate('/seller/dashboard');
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#FAF7F2'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E6DEC9',
        boxShadow: '0 14px 44px rgba(24, 54, 38, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Header Banner */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '28px',
          textAlign: 'center'
        }}>
          <BrandLogo variant="compact" theme="light" size="md" />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(232, 197, 130, 0.2)', color: '#E8C582', padding: '4px 12px', borderRadius: '14px', fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: '10px' }}>
            <Award size={14} /> Dairy Producer &amp; Farmer Portal
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FAF7F2', margin: '10px 0 4px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
            Seller Sign In
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#CBD5CB' }}>
            Manage your livestock yield, dairy SKUs, doorstep dispatches, and farm payouts.
          </p>
        </div>

        {/* 1-Click Demo Evaluation Shortcuts */}
        <div style={{
          backgroundColor: '#FAF5EE',
          borderBottom: '1px solid #E6DEC9',
          padding: '12px 18px'
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#A26D24', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} /> 1-Click Demo Evaluation Logins:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo({ id: 'usr-seller-02', name: 'K. Murugan', farm: 'Green Valley Dairy Farm', email: 'murugan.farm@milkmart.farm', password: 'farmer123' })}
              style={{
                padding: '6px 4px',
                borderRadius: '8px',
                border: '1px solid #183626',
                backgroundColor: '#FFFFFF',
                color: '#183626',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🌿 Green Valley
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo({ id: 'usr-seller-03', name: 'Lakshmi Narayanan', farm: 'Sri Lakshmi Organic Farm', email: 'lakshmi.farm@milkmart.farm', password: 'farmer123' })}
              style={{
                padding: '6px 4px',
                borderRadius: '8px',
                border: '1px solid #A26D24',
                backgroundColor: '#FFFFFF',
                color: '#A26D24',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🌾 Sri Lakshmi
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo({ id: 'usr-seller-01', name: 'Devendra Patel', farm: 'Gir Amrit Gaushala', email: 'farmer.patel@milkmart.farm', password: 'farmer123' })}
              style={{
                padding: '6px 4px',
                borderRadius: '8px',
                border: '1px solid #0E587B',
                backgroundColor: '#FFFFFF',
                color: '#0E587B',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🥛 Gir Amrit
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FDE8E4',
              color: '#B2341A',
              border: '1px solid rgba(178, 52, 26, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '18px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Email or Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. murugan.farm@milkmart.farm"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#183626' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#A26D24', fontWeight: '600', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#798C80',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="rememberSeller"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#183626' }}
              />
              <label htmlFor="rememberSeller" style={{ fontSize: '0.82rem', color: '#55685C', cursor: 'pointer' }}>
                Remember my farm session on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? 'Verifying Credentials...' : 'Sign In to Seller Dashboard'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Links */}
          <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.85rem', color: '#55685C' }}>
            Are you a new dairy farmer or artisan producer?{' '}
            <Link to="/seller/register" style={{ color: '#183626', fontWeight: '700', textDecoration: 'none' }}>
              Register Your Farm →
            </Link>
          </div>

          <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.8rem' }}>
            <Link to="/" style={{ color: '#798C80', textDecoration: 'none' }}>
              ← Return to MilkMart Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
