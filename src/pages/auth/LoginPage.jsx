import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import { 
  Lock, Mail, User, ShieldCheck, Truck, Award, 
  ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Smartphone 
} from 'lucide-react';

export const LoginPage = () => {
  const { login, sendOtp, verifyOtp, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'delivery' | 'admin' | 'seller'
  const [email, setEmail] = useState('surya.prakash@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP flow state
  const [otpIdentifier, setOtpIdentifier] = useState('+91 98450 12345');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Return destination after successful login
  const fromLocation = location.state?.from?.pathname;

  const getDestinationForRole = (role) => {
    if (fromLocation && !fromLocation.includes('/login') && !fromLocation.includes('/unauthorized')) {
      return fromLocation;
    }
    if (role === 'admin') return '/admin';
    if (role === 'delivery') return '/partner';
    if (role === 'seller') return '/seller';
    return '/account';
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    setError('');
    if (role === 'admin') {
      setEmail('admin@milkmart.farm');
      setPassword('admin123');
      setOtpIdentifier('admin@milkmart.farm');
    } else if (role === 'delivery') {
      setEmail('ramesh.delivery@milkmart.farm');
      setPassword('partner123');
      setOtpIdentifier('+91 98450 99999');
    } else if (role === 'seller') {
      setEmail('farmer.patel@milkmart.farm');
      setPassword('farmer123');
      setOtpIdentifier('+91 94432 10987');
    } else {
      setEmail('surya.prakash@example.com');
      setPassword('password123');
      setOtpIdentifier('+91 98450 12345');
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpIdentifier.trim()) {
      setError('Please enter your mobile phone or email.');
      return;
    }
    setError('');
    setIsSendingOtp(true);
    try {
      const res = await sendOtp(otpIdentifier);
      setIsOtpSent(true);
      setCountdown(60);
      showToast(res.message || 'OTP sent via WhatsApp and SMS!');
      if (res.demoOtp) setOtpCode(res.demoOtp);
    } catch (err) {
      setError(err.message || 'Failed to dispatch OTP code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await verifyOtp(otpIdentifier, otpCode, activeTab);
      setIsSubmitting(false);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name || 'valued user'}!`);
        navigate(getDestinationForRole(res.user.role), { replace: true });
      } else {
        setError(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'OTP verification failed.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(email, password, activeTab);
      setIsSubmitting(false);

      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`);
        navigate(getDestinationForRole(res.user.role), { replace: true });
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    }, 300);
  };

  const handleQuickDemo = (role) => {
    switchRole(role);
    if (role === 'admin') {
      showToast("Signed in as Operations Master (Admin)");
      navigate('/admin');
    } else if (role === 'delivery') {
      showToast("Signed in as Ramesh Kumar (Delivery Fleet)");
      navigate('/partner');
    } else if (role === 'seller') {
      showToast("Signed in as Devendra Patel (Farm Producer)");
      navigate('/seller');
    } else {
      showToast("Signed in as Surya Prakash (Customer)");
      navigate('/account');
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#FAF7F2'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E6DEC9',
        boxShadow: '0 12px 40px rgba(24, 54, 38, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Brand Banner Header */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '28px 28px 22px 28px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'inline-block', marginBottom: '10px' }}>
            <BrandLogo variant="compact" theme="light" size="md" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FAF7F2', margin: '0 0 6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
            Welcome to MilkMart
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#CBD5CB' }}>
            Pure farm-fresh milk delivered daily in returnable glass bottles
          </p>
        </div>

        {/* 1-Click Instant Demo Login Bar */}
        <div style={{
          backgroundColor: '#FAF5EE',
          borderBottom: '1px solid #E6DEC9',
          padding: '12px 20px'
        }}>
          <div style={{
            fontSize: '0.74rem',
            fontWeight: '800',
            color: '#8E5A17',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} color="#A26D24" /> Instant 1-Click Demo Evaluation:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
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
              <User size={12} /> Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('delivery')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '6px 4px',
                borderRadius: '8px',
                border: '1px solid #196D3D',
                backgroundColor: '#FFFFFF',
                color: '#196D3D',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Truck size={12} /> Partner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('seller')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
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
              <Award size={12} /> Seller
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
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
              <ShieldCheck size={12} /> Admin
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div style={{ padding: '24px 28px' }}>
          {/* Role Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: '#FAF5EE',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid #EFE8D8'
          }}>
            <button
              type="button"
              onClick={() => handleTabChange('customer')}
              style={{
                flex: 1,
                padding: '8px 2px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: activeTab === 'customer' ? '700' : '600',
                backgroundColor: activeTab === 'customer' ? '#183626' : 'transparent',
                color: activeTab === 'customer' ? '#FAF7F2' : '#55685C',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('delivery')}
              style={{
                flex: 1,
                padding: '8px 2px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: activeTab === 'delivery' ? '700' : '600',
                backgroundColor: activeTab === 'delivery' ? '#183626' : 'transparent',
                color: activeTab === 'delivery' ? '#FAF7F2' : '#55685C',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Partner
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('seller')}
              style={{
                flex: 1,
                padding: '8px 2px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: activeTab === 'seller' ? '700' : '600',
                backgroundColor: activeTab === 'seller' ? '#183626' : 'transparent',
                color: activeTab === 'seller' ? '#FAF7F2' : '#55685C',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Farm Seller
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              style={{
                flex: 1,
                padding: '8px 2px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: activeTab === 'admin' ? '700' : '600',
                backgroundColor: activeTab === 'admin' ? '#183626' : 'transparent',
                color: activeTab === 'admin' ? '#FAF7F2' : '#55685C',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Admin Hub
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#FDE8E4',
              color: '#B2341A',
              border: '1px solid rgba(178, 52, 26, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Authentication Mode Switcher */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '18px',
            borderBottom: '1px solid #EFE8D8',
            paddingBottom: '12px'
          }}>
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: loginMethod === 'password' ? '700' : '600',
                backgroundColor: loginMethod === 'password' ? '#183626' : '#FAF5EE',
                color: loginMethod === 'password' ? '#FAF7F2' : '#55685C',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Lock size={13} /> Password Sign In
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('otp'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: loginMethod === 'otp' ? '700' : '600',
                backgroundColor: loginMethod === 'otp' ? '#183626' : '#FAF5EE',
                color: loginMethod === 'otp' ? '#FAF7F2' : '#55685C',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Smartphone size={13} /> WhatsApp / SMS OTP
            </button>
          </div>

          {loginMethod === 'otp' ? (
            <div>
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                      Registered Mobile Number or Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Smartphone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                      <input
                        type="text"
                        required
                        value={otpIdentifier}
                        onChange={(e) => setOtpIdentifier(e.target.value)}
                        placeholder="+91 98450 12345 or user@example.com"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          borderRadius: '10px',
                          border: '1.5px solid #E6DEC9',
                          fontSize: '0.9rem',
                          color: '#183626',
                          backgroundColor: '#FAF7F2'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#798C80', marginTop: '6px', display: 'block' }}>
                      We will instantly dispatch a 6-digit OTP code to your WhatsApp and SMS.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: '12px',
                      backgroundColor: '#183626',
                      color: '#FAF7F2',
                      border: 'none',
                      fontSize: '0.96rem',
                      fontWeight: '700',
                      cursor: isSendingOtp ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isSendingOtp ? 'Sending OTP Code...' : 'Send WhatsApp & SMS Code'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{
                    backgroundColor: '#E8F5EE',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#196D3D', fontWeight: '700' }}>OTP DISPATCHED TO:</div>
                      <strong style={{ fontSize: '0.88rem', color: '#183626' }}>{otpIdentifier}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsOtpSent(false); setOtpCode(''); }}
                      style={{ background: 'none', border: 'none', color: '#196D3D', fontSize: '0.74rem', textDecoration: 'underline', cursor: 'pointer', fontWeight: '700' }}
                    >
                      Edit
                    </button>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '2px solid #183626',
                        fontSize: '1.3rem',
                        letterSpacing: '6px',
                        textAlign: 'center',
                        fontWeight: '800',
                        color: '#183626',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', fontSize: '0.76rem' }}>
                    <button
                      type="button"
                      onClick={() => setOtpCode('123456')}
                      style={{
                        border: '1px dashed #A26D24',
                        background: '#FAF5EE',
                        color: '#8E5A17',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '700'
                      }}
                    >
                      ⚡ Auto-fill Test Code: 123456
                    </button>
                    {countdown > 0 ? (
                      <span style={{ color: '#798C80' }}>Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        style={{ background: 'none', border: 'none', color: '#183626', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: '12px',
                      backgroundColor: '#183626',
                      color: '#FAF7F2',
                      border: 'none',
                      fontSize: '0.96rem',
                      fontWeight: '700',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    {isSubmitting ? 'Verifying...' : `Verify OTP & Access ${activeTab === 'delivery' ? 'Fleet' : activeTab === 'admin' ? 'Admin Hub' : 'Account'}`}
                  </button>
                </form>
              )}
            </div>
          ) : (
          <form onSubmit={handleLoginSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: '700', color: '#183626' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.78rem', color: '#A26D24', fontWeight: '600', textDecoration: 'none' }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 42px 11px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '0.9rem',
                    color: '#183626',
                    backgroundColor: '#FAF7F2'
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
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#183626', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.84rem', color: '#55685C', cursor: 'pointer' }}>
                Remember my session on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                backgroundColor: '#183626',
                color: '#FAF7F2',
                border: 'none',
                fontSize: '0.96rem',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(24, 54, 38, 0.2)',
                transition: 'background-color 0.15s ease'
              }}
            >
              {isSubmitting ? 'Signing in...' : `Sign in as ${activeTab === 'delivery' ? 'Fleet Driver' : activeTab === 'admin' ? 'Admin' : 'Customer'}`}
              <ArrowRight size={16} />
            </button>
          </form>
          )}

          {/* Footer Signup Link */}
          <div style={{
            marginTop: '22px',
            textAlign: 'center',
            fontSize: '0.86rem',
            color: '#55685C',
            borderTop: '1px solid #F1EDE3',
            paddingTop: '18px'
          }}>
            Don't have a MilkMart account yet?{' '}
            <Link
              to="/signup"
              state={{ defaultRole: activeTab === 'delivery' ? 'delivery' : 'customer' }}
              style={{ color: '#A26D24', fontWeight: '700', textDecoration: 'none' }}
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
