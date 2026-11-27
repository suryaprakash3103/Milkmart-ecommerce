import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { 
  X, ShieldCheck, Truck, User, LogIn, Sparkles, 
  Smartphone, Mail, KeyRound, ArrowRight, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export const AuthModal = ({ isOpen, onClose, initialTab = 'otp' }) => {
  const { login, signup, sendOtp, verifyOtp, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Mode: 'otp' | 'password' | 'register'
  const [tab, setTab] = useState(initialTab);
  
  // OTP Flow state
  const [otpIdentifier, setOtpIdentifier] = useState('+91 98450 12345');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Password / Registration state
  const [email, setEmail] = useState('surya.prakash@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Surya Prakash');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [isLoading, setIsLoading] = useState(false);

  // Timer countdown effect for OTP resend
  useEffect(() => {
    let timer;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  if (!isOpen) return null;

  // Handler: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpIdentifier.trim()) {
      setOtpError('Please enter a valid mobile number or email.');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);

    try {
      const res = await sendOtp(otpIdentifier);
      setIsOtpSent(true);
      setCountdown(60);
      showToast(res.message || 'Verification code dispatched via SMS & WhatsApp!');
      if (res.demoOtp) {
        setOtpCode(res.demoOtp);
      }
    } catch (err) {
      setOtpError(err.message || 'Failed to dispatch code. Try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handler: Verify OTP & Sign In
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }
    setOtpError('');
    setIsVerifying(true);

    try {
      const res = await verifyOtp(otpIdentifier, otpCode, 'customer', name);
      if (res.success) {
        showToast(`Welcome to MilkMart, ${res.user.name || 'valued customer'}! ₹500 welcome credit active.`);
        onClose();
        navigate('/');
      } else {
        setOtpError(res.message || 'Invalid verification code.');
      }
    } catch (err) {
      setOtpError(err.message || 'Verification failed. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handler: Password Login
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (tab === 'register') {
      const res = await signup({ name, email, phone, password }, 'customer');
      setIsLoading(false);
      if (res.success) {
        showToast(`Account created! Welcome, ${name}!`);
        onClose();
        navigate('/');
      } else {
        setOtpError(res.message || 'Registration failed.');
      }
    } else {
      const res = await login(email, password, 'customer');
      setIsLoading(false);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`);
        onClose();
        navigate('/');
      } else {
        setOtpError(res.message || 'Invalid email or password.');
      }
    }
  };

  // Handler: Quick Demo Switch
  const handleDemoLogin = (role) => {
    switchRole(role);
    if (role === 'admin') {
      showToast("Signed in as Operations Master (Admin Aditi)");
      onClose();
      navigate('/admin');
    } else if (role === 'delivery') {
      showToast("Signed in as Ramesh Kumar (Morning Route 4B Partner)");
      onClose();
      navigate('/partner');
    } else if (role === 'seller') {
      showToast("Signed in as Devendra Patel (Green Valley Dairy)");
      onClose();
      navigate('/seller');
    } else {
      showToast("Signed in as Customer (Surya Prakash)");
      onClose();
      navigate('/account');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 35, 24, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '500px', 
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: '1.5px solid #E6DEC9'
        }}
      >
        {/* Header */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '24px 28px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: '#FAF7F2',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ marginBottom: '10px' }}>
            <BrandLogo variant="compact" theme="light" size="sm" />
          </div>
          <h3 style={{ fontSize: '1.35rem', color: '#FAF7F2', margin: 0, fontFamily: 'Fraunces, Georgia, serif' }}>
            {tab === 'otp' ? "Instant OTP Sign In" : tab === 'password' ? "Sign In with Password" : "Join the Glass-Bottle Loop"}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#CBD5CB' }}>
            Daily morning runs, chemical-free A2 milk & artisan dairy before sunrise
          </p>
        </div>

        {/* 1-Click Persona Evaluation Presets */}
        <div style={{
          backgroundColor: '#FAF5EE',
          borderBottom: '1px solid #E6DEC9',
          padding: '10px 24px'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#8E5A17', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={12} /> 1-Click Instant Demo Login:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button
              onClick={() => handleDemoLogin('customer')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '4px 6px', justifyContent: 'center' }}
            >
              👤 Customer
            </button>
            <button
              onClick={() => handleDemoLogin('delivery')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '4px 6px', justifyContent: 'center' }}
            >
              🚚 Partner
            </button>
            <button
              onClick={() => handleDemoLogin('seller')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '4px 6px', justifyContent: 'center' }}
            >
              🌾 Seller
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '4px 6px', justifyContent: 'center', color: '#0E587B' }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ padding: '20px 24px 0 24px' }}>
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#F3EFE6', 
            borderRadius: '12px', 
            padding: '4px',
            gap: '4px' 
          }}>
            <button
              type="button"
              onClick={() => { setTab('otp'); setOtpError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: tab === 'otp' ? '700' : '500',
                backgroundColor: tab === 'otp' ? '#FFFFFF' : 'transparent',
                color: tab === 'otp' ? '#183626' : '#55685C',
                border: 'none',
                boxShadow: tab === 'otp' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Smartphone size={14} /> OTP Login
            </button>

            <button
              type="button"
              onClick={() => { setTab('password'); setOtpError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: tab === 'password' ? '700' : '500',
                backgroundColor: tab === 'password' ? '#FFFFFF' : 'transparent',
                color: tab === 'password' ? '#183626' : '#55685C',
                border: 'none',
                boxShadow: tab === 'password' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <KeyRound size={14} /> Password
            </button>

            <button
              type="button"
              onClick={() => { setTab('register'); setOtpError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: tab === 'register' ? '700' : '500',
                backgroundColor: tab === 'register' ? '#FFFFFF' : 'transparent',
                color: tab === 'register' ? '#183626' : '#55685C',
                border: 'none',
                boxShadow: tab === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Error message */}
        {otpError && (
          <div style={{ margin: '14px 24px 0 24px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', fontSize: '0.82rem' }}>
            {otpError}
          </div>
        )}

        {/* Tab 1: OTP Workflow */}
        {tab === 'otp' && (
          <div style={{ padding: '20px 24px 24px 24px' }}>
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                    Mobile Number or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      value={otpIdentifier}
                      onChange={(e) => setOtpIdentifier(e.target.value)}
                      placeholder="+91 98450 12345 or user@example.com"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: '10px',
                        border: '1.5px solid #CCD8D0',
                        fontSize: '0.92rem'
                      }}
                    />
                    <Smartphone size={18} color="#798C80" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#798C80', marginTop: '4px', display: 'block' }}>
                    We'll send a 6-digit verification code via WhatsApp &amp; SMS.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isSendingOtp ? 'Sending Code...' : 'Get Verification Code'} <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{
                  backgroundColor: '#E8F5EE',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#196D3D', fontWeight: '700' }}>CODE SENT VIA WHATSAPP &amp; SMS TO:</div>
                    <strong style={{ fontSize: '0.9rem', color: '#183626' }}>{otpIdentifier}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsOtpSent(false); setOtpCode(''); }}
                    style={{ background: 'none', border: 'none', color: '#196D3D', fontSize: '0.76rem', textDecoration: 'underline', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Change
                  </button>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                    Enter 6-Digit Verification Code
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
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #183626',
                      fontSize: '1.4rem',
                      letterSpacing: '8px',
                      textAlign: 'center',
                      fontWeight: '800',
                      color: '#183626'
                    }}
                  />
                </div>

                {/* Demo Helper Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  fontSize: '0.76rem'
                }}>
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
                    ⚡ Auto-fill Demo OTP: 123456
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
                  disabled={isVerifying}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CheckCircle2 size={18} /> {isVerifying ? 'Verifying...' : 'Verify OTP & Log In'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2 & 3: Password Login & Register */}
        {(tab === 'password' || tab === 'register') && (
          <form onSubmit={handlePasswordSubmit} style={{ padding: '20px 24px 24px 24px' }}>
            {tab === 'register' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Surya Prakash" 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCD8D0' }} 
                />
              </div>
            )}

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com" 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCD8D0' }} 
              />
            </div>

            {tab === 'register' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Mobile Phone</label>
                <input 
                  type="text" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+91 98450 12345" 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCD8D0' }} 
                />
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCD8D0' }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LogIn size={18} /> {isLoading ? 'Processing...' : tab === 'password' ? "Sign In to MilkMart" : "Create Account (₹500 Credit)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
