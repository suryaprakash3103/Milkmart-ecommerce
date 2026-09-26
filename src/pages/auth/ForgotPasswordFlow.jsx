import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../../data/store';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const ForgotPasswordFlow = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('surya.prakash@example.com');
  const [generatedOtp, setGeneratedOtp] = useState('4821');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    const user = Store.findUserByEmail(email);
    if (!user) {
      setError('No MilkMart account found with this email. Try surya.prakash@example.com');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep(2);
    showToast(`Simulated SMS/Email OTP sent: ${code}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    if (enteredOtp !== generatedOtp && enteredOtp !== '4821') {
      setError(`Invalid OTP. Please enter the simulated code: ${generatedOtp}`);
      return;
    }
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const ok = Store.updateUserPassword(email, newPassword);
    if (ok) {
      setStep(4);
      showToast('Password reset successfully! You can now log in.');
    } else {
      setError('Failed to update password. Please try again.');
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
        maxWidth: '460px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E6DEC9',
        boxShadow: '0 12px 40px rgba(24, 54, 38, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Banner */}
        <div style={{
          backgroundColor: '#183626',
          color: '#FAF7F2',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'inline-block', marginBottom: '8px' }}>
            <BrandLogo variant="compact" theme="light" size="sm" />
          </div>
          <h2 style={{ fontSize: '1.45rem', color: '#FAF7F2', margin: '0 0 4px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
            Reset Account Password
          </h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5CB' }}>
            {step === 1 && "Enter your registered email to receive a verification OTP"}
            {step === 2 && "Enter the 4-digit code sent to your registered account"}
            {step === 3 && "Create a secure new password for morning deliveries"}
            {step === 4 && "Password changed successfully!"}
          </p>
        </div>

        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FDE8E4',
              color: '#B2341A',
              border: '1px solid rgba(178, 52, 26, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '0.84rem'
            }}>
              {error}
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Registered Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#798C80' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                Send Simulated OTP Code <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* STEP 2: Enter 4-digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div style={{
                backgroundColor: '#FAF5EE',
                border: '1px solid #E6DEC9',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '18px',
                fontSize: '0.84rem',
                color: '#8E5A17',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles size={16} color="#A26D24" />
                <div>
                  <strong>Simulated Demo OTP:</strong> <code style={{ backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', fontSize: '1rem', color: '#183626' }}>{generatedOtp}</code>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '6px' }}>
                  Enter 4-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="e.g. 4821"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1.5px solid #E6DEC9',
                    fontSize: '1.4rem',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    fontWeight: '800',
                    color: '#183626'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline-dark"
                  style={{ flex: 1 }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  Verify OTP <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#183626', marginBottom: '4px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E6DEC9' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                Update Password
              </button>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#E8F5EE', color: '#196D3D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ color: '#183626', fontSize: '1.2rem', marginBottom: '8px' }}>
                Password Updated!
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#55685C', marginBottom: '22px' }}>
                Your MilkMart account password has been updated. You can now log in securely.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                Go to Sign In
              </button>
            </div>
          )}

          {/* Back to Login link */}
          {step !== 4 && (
            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.84rem' }}>
              <Link to="/login" style={{ color: '#798C80', textDecoration: 'none' }}>
                Remember your password? <strong>Back to Sign In</strong>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
